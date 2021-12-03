using Orbital.Mock.Server.Services;
using Xunit;
using System.Net.Http;
using Microsoft.Extensions.Options;
using NSubstitute;
using System.Linq;

namespace Orbital.Mock.Server.Tests.Services
{
    public class PublicKeyServiceTests
    {
        private const string OPEN_ID_CONFIG_ENDPOINT = "http://test-mock/.well-known/openid-configuration";
        private const string JWKS_ENDPOINT = "http://test-mock/.well-known/openid-configuration/jwks";
        private readonly string OPEN_ID_CONFIG = $"{{\"issuer\":\"http://test-mock\",\"jwks_uri\":\"{JWKS_ENDPOINT}\",\"authorization_endpoint\":\"http://test-mock/connect/authorize\",\"token_endpoint\":\"http://test-mock/connect/token\"}}";
        private const string JWKS = "{\"keys\":[{\"kty\":\"RSA\",\"use\":\"sig\",\"kid\":\"59A641AB533F2D5C6A05D209CEC048E4\",\"e\":\"AQAB\",\"n\":\"tldKq4oYfHL8o6rQNh5T9gF3DKbLZtKSKu3ugfei2gb_7M3plc4CZIA4sbM09T7IVVZBCQad3pT4ALkKT5s_5bfGAtSc36ug6luHrAG8a-23lRh-t6XL5GXSoAIKvOSqfac6u9vYtLGdDLXmBn-Fv8iaV4O-InFsM7v_ChOk9ycULH5dYseXokMK_qMvbmyqfVzEXCMYsAAdLdvy6CRFjnWADMaTkil6REHnhaIxi-0t-spEvINJYsr9cjKkdUjOYAdg0JX7gVf6fUa3RlYJansgZJmtEXaxBMzw5a5DrfYTWsTRYu3p_ZZsKseOZBsV_BPR5d8InPnZAY5KEuBXAQ\",\"alg\":\"RS256\"}]}";
        private const string KID = "59A641AB533F2D5C6A05D209CEC048E4";
        private const string JWKS_ALT = "{\"keys\":[{\"kty\":\"RSA\",\"use\":\"sig\",\"kid\":\"FC696F076987E522EC06C01F32D0D48A\",\"e\":\"AQAB\",\"n\":\"7Jf7j6fC3Ta7gveJPwpeCgzyZrTigtLyIwnOOASCQE8ukjtAZwh2Jky2BRIA7BYAtC6qSclkeL38Ten2cdsCttrSKKE58fV_wfONQ20Bbbx7OYQAYzP4v8SB8f_DkHEth5QpMa9XuYbFvHT4itHRxf6UFZJHbl4IjurMulfYitRatQwc0eRpvI9xw9cQ-DEsYOG2VJkgy5noBsDkI7A3X-lRSWNCU1y7i6WZ11glm6PaPLLjZzde1S7tbb4vS5sdeC3j-dgfz2DyyvKbPI-A-VNeRmhpNav99Lag7bVZME5bNTAreBKxni_B3u0qEn9apduzbscT2_7uhK3bX6mGlw\",\"alg\":\"RS256\"}]}";
        private const string KID_ALT = "FC696F076987E522EC06C01F32D0D48A";
        private const string BAD_JWKS = "{\"keys\":[{\"kty\":\"RSA\",\"use\":\"sig\",\"alg\":\"RS256\"}]}";

        public static IOptions<PublicKeyServiceConfig> GetPublicKeyServiceConfig(
            string JWKS_ENDPOINT = null,
            string JWKS = null,
            string CACHE_TIME_HOURS = "8")
        {
            var config_mock = Substitute.For<IOptions<PublicKeyServiceConfig>>();
            config_mock.Value.Returns(new PublicKeyServiceConfig
            {
                JWKS_ENDPOINT = JWKS_ENDPOINT,
                JWKS = JWKS,
                CACHE_TIME_HOURS = CACHE_TIME_HOURS,
            });
            return config_mock;
        }

        [Fact]
        public void NoKeyFoundBecasueOfNoSourcesTest()
        {
            #region Test Setup
            var messageHandler = new MockHttpMessageHandler("");
            var publicKeyService = new PublicKeyService(GetPublicKeyServiceConfig(), new HttpClient(messageHandler));
            #endregion

            var Actual = publicKeyService.GetKey("NotAKeyId");
            Assert.Null(Actual);
            Assert.Equal(0, messageHandler.NumberOfCalls);
            Assert.Empty(publicKeyService.IssuerSigningKeyResolver(null, null, "NotAKeyId", null));
            Assert.Empty(publicKeyService.GetAllKeys());
        }

        [Fact]
        public void CacheExpirationTest()
        {
            #region Test Setup
            var config = GetPublicKeyServiceConfig(JWKS_ENDPOINT: JWKS_ENDPOINT, CACHE_TIME_HOURS: "0");
            var messageHandler = new MockHttpMessageHandler();
            messageHandler.AddResponse(JWKS_ENDPOINT, JWKS);

            var publicKeyService = new PublicKeyService(config, new HttpClient(messageHandler));
            #endregion

            var Actual = publicKeyService.GetKey(KID);
            Assert.NotNull(Actual);
            Assert.Equal(KID, Actual.Kid);

            messageHandler.ClearResponses();
            messageHandler.AddResponse(JWKS_ENDPOINT, "{\"keys\":[]}");
            Assert.Null(publicKeyService.GetKey(KID));

            Assert.Equal(2, messageHandler.NumberOfCalls);
            Assert.Empty(publicKeyService.GetAllKeys());
        }

        [Fact]
        public void GetKeyFromJwksEndpointTest()
        {
            #region Test Setup
            var config = GetPublicKeyServiceConfig(JWKS_ENDPOINT: JWKS_ENDPOINT);
            var messageHandler = new MockHttpMessageHandler(JWKS);

            var publicKeyService = new PublicKeyService(config, new HttpClient(messageHandler));
            #endregion

            var Actual = publicKeyService.GetKey(KID);
            Assert.NotNull(Actual);
            Assert.Equal(KID, Actual.Kid);
            Assert.Null(publicKeyService.GetKey("NotAKeyId"));
            Assert.Equal(1, messageHandler.NumberOfCalls);
            Assert.Single(publicKeyService.GetAllKeys());

            var ResolverActual = publicKeyService.IssuerSigningKeyResolver(null, null, KID, null);
            Assert.Single(ResolverActual);
            Assert.Equal(KID, ResolverActual.ElementAt(0).KeyId);
            Assert.Empty(publicKeyService.IssuerSigningKeyResolver(null, null, "NotAKeyId", null));
        }

        [Fact]
        public void GetKeyFromJwksEndpointWithNonJsonDataTest()
        {
            #region Test Setup
            var config = GetPublicKeyServiceConfig(JWKS_ENDPOINT: JWKS_ENDPOINT);
            var messageHandler = new MockHttpMessageHandler("This is not a json string");

            var publicKeyService = new PublicKeyService(config, new HttpClient(messageHandler));
            #endregion

            var Actual = publicKeyService.GetKey(KID);
            Assert.Null(Actual);
            Assert.Equal(1, messageHandler.NumberOfCalls);
            Assert.Empty(publicKeyService.GetAllKeys());
        }

        [Fact]
        public void GetKeyFromJwksEndpointWithBadJsonDataTest()
        {
            #region Test Setup
            var config = GetPublicKeyServiceConfig(JWKS_ENDPOINT: JWKS_ENDPOINT);
            var messageHandler = new MockHttpMessageHandler("{ \"some-key\": \"Some Value\" }");

            var publicKeyService = new PublicKeyService(config, new HttpClient(messageHandler));
            #endregion

            var Actual = publicKeyService.GetKey(KID);
            Assert.Null(Actual);
            Assert.Equal(1, messageHandler.NumberOfCalls);
            Assert.Empty(publicKeyService.GetAllKeys());
        }

        [Fact]
        public void GetKeyFromJwksEndpointWithBadJwkTest()
        {
            #region Test Setup
            var config = GetPublicKeyServiceConfig(JWKS_ENDPOINT: JWKS_ENDPOINT);
            var messageHandler = new MockHttpMessageHandler(BAD_JWKS);

            var publicKeyService = new PublicKeyService(config, new HttpClient(messageHandler));
            #endregion

            var Actual = publicKeyService.GetKey(KID);
            Assert.Null(Actual);
            Assert.Equal(1, messageHandler.NumberOfCalls);
            Assert.Empty(publicKeyService.GetAllKeys());
        }

        [Fact]
        public void GetKeyFromConfigEndpointTest()
        {
            #region Test Setup
            var config = GetPublicKeyServiceConfig(JWKS_ENDPOINT: OPEN_ID_CONFIG_ENDPOINT);
            var messageHandler = new MockHttpMessageHandler();
            messageHandler.AddResponse(OPEN_ID_CONFIG_ENDPOINT, OPEN_ID_CONFIG);
            messageHandler.AddResponse(JWKS_ENDPOINT, JWKS);

            var publicKeyService = new PublicKeyService(config, new HttpClient(messageHandler));
            #endregion

            var Actual = publicKeyService.GetKey(KID);
            Assert.NotNull(Actual);
            Assert.Equal(KID, Actual.Kid);
            Assert.Equal(2, messageHandler.NumberOfCalls);
            Assert.Single(publicKeyService.GetAllKeys());
        }

        [Fact]
        public void GetKeyFromConfigEndpointNoJsonDataTest()
        {
            #region Test Setup
            var config = GetPublicKeyServiceConfig(JWKS_ENDPOINT: OPEN_ID_CONFIG_ENDPOINT);
            var messageHandler = new MockHttpMessageHandler();
            messageHandler.AddResponse(OPEN_ID_CONFIG_ENDPOINT, OPEN_ID_CONFIG);
            messageHandler.AddResponse(JWKS_ENDPOINT, "This is not a json string");

            var publicKeyService = new PublicKeyService(config, new HttpClient(messageHandler));
            #endregion

            var Actual = publicKeyService.GetKey(KID);
            Assert.Null(Actual);
            Assert.Equal(2, messageHandler.NumberOfCalls);
            Assert.Empty(publicKeyService.GetAllKeys());
        }

        [Fact]
        public void GetKeyFromConfigEndpointBadJsonDataTest()
        {
            #region Test Setup
            var config = GetPublicKeyServiceConfig(JWKS_ENDPOINT: OPEN_ID_CONFIG_ENDPOINT);
            var messageHandler = new MockHttpMessageHandler();
            messageHandler.AddResponse(OPEN_ID_CONFIG_ENDPOINT, OPEN_ID_CONFIG);
            messageHandler.AddResponse(JWKS_ENDPOINT, "{ \"some-key\": \"Some Value\" }");

            var publicKeyService = new PublicKeyService(config, new HttpClient(messageHandler));
            #endregion

            var Actual = publicKeyService.GetKey(KID);
            Assert.Null(Actual);
            Assert.Equal(2, messageHandler.NumberOfCalls);
            Assert.Empty(publicKeyService.GetAllKeys());
        }

        [Fact]
        public void GetKeyFromConfigEndpointBadJkwDataTest()
        {
            #region Test Setup
            var config = GetPublicKeyServiceConfig(JWKS_ENDPOINT: OPEN_ID_CONFIG_ENDPOINT);
            var messageHandler = new MockHttpMessageHandler();
            messageHandler.AddResponse(OPEN_ID_CONFIG_ENDPOINT, OPEN_ID_CONFIG);
            messageHandler.AddResponse(JWKS_ENDPOINT, BAD_JWKS);

            var publicKeyService = new PublicKeyService(config, new HttpClient(messageHandler));
            #endregion

            var Actual = publicKeyService.GetKey(KID);
            Assert.Null(Actual);
            Assert.Equal(2, messageHandler.NumberOfCalls);
            Assert.Empty(publicKeyService.GetAllKeys());
        }

        [Fact]
        public void GetKeyFromJwksConfigVarTest()
        {
            #region Test Setup
            var config = GetPublicKeyServiceConfig(JWKS: JWKS);
            var publicKeyService = new PublicKeyService(config);
            #endregion

            var Actual = publicKeyService.GetKey(KID);
            Assert.NotNull(Actual);
            Assert.Equal(KID, Actual.Kid);

            var ResolverActual = publicKeyService.IssuerSigningKeyResolver(null, null, KID, null);
            Assert.Single(ResolverActual);
            Assert.Equal(KID, ResolverActual.ElementAt(0).KeyId);
            Assert.Empty(publicKeyService.IssuerSigningKeyResolver(null, null, "NotAKeyId", null));
            Assert.Single(publicKeyService.GetAllKeys());
        }

        [Fact]
        public void GetKeyFromJwksConfigVarWithNonJsonDataTest()
        {
            #region Test Setup
            var config = GetPublicKeyServiceConfig(JWKS: "This is not a json string");
            var publicKeyService = new PublicKeyService(config);
            #endregion

            var Actual = publicKeyService.GetKey(KID);
            Assert.Null(Actual);
            Assert.Empty(publicKeyService.GetAllKeys());
        }

        [Fact]
        public void GetKeyFromJwksConfigVarWithBadJsonDataTest()
        {
            #region Test Setup
            var config = GetPublicKeyServiceConfig(JWKS: "{ \"some-key\": \"Some Value\" }");
            var publicKeyService = new PublicKeyService(config);
            #endregion

            var Actual = publicKeyService.GetKey(KID);
            Assert.Null(Actual);
            Assert.Empty(publicKeyService.GetAllKeys());
        }

        [Fact]
        public void GetKeyFromJwksConfigVarWithBadJwkTest()
        {
            #region Test Setup
            var config = GetPublicKeyServiceConfig(JWKS: BAD_JWKS);
            var publicKeyService = new PublicKeyService(config);
            #endregion

            var Actual = publicKeyService.GetKey(KID);
            Assert.Null(Actual);
            Assert.Empty(publicKeyService.GetAllKeys());
        }

        [Fact]
        public void GetMultipleKeysFromMultipleSourcesTest()
        {
            #region Test Setup
            var config = GetPublicKeyServiceConfig(JWKS_ENDPOINT: JWKS_ENDPOINT, JWKS: JWKS_ALT);
            var messageHandler = new MockHttpMessageHandler(JWKS);
            var publicKeyService = new PublicKeyService(config, new HttpClient(messageHandler));
            #endregion
            
            var Actual = publicKeyService.GetKey(KID);
            Assert.NotNull(Actual);
            Assert.Equal(KID, Actual.Kid);
            var ActualAlt = publicKeyService.GetKey(KID_ALT);
            Assert.NotNull(ActualAlt);
            Assert.Equal(KID_ALT, ActualAlt.Kid);

            Assert.Equal(2, publicKeyService.GetAllKeys().Count());
            Assert.Null(publicKeyService.GetKey("NotAKeyId"));
            Assert.Equal(1, messageHandler.NumberOfCalls);
        }

        [Fact]
        public void DoesNotAddDuplicateKeysTest()
        {
            #region Test Setup
            var config = GetPublicKeyServiceConfig(JWKS_ENDPOINT: JWKS_ENDPOINT, JWKS: JWKS);
            var messageHandler = new MockHttpMessageHandler(JWKS);
            var publicKeyService = new PublicKeyService(config, new HttpClient(messageHandler));
            #endregion

            var Actual = publicKeyService.GetKey(KID);
            Assert.NotNull(Actual);
            Assert.Equal(KID, Actual.Kid);

            Assert.Single(publicKeyService.GetAllKeys());
            Assert.Null(publicKeyService.GetKey("NotAKeyId"));
            Assert.Equal(1, messageHandler.NumberOfCalls);
        }

    }
}
