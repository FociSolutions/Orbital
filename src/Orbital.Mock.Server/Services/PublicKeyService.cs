using System;
using System.Collections.Generic;
using Orbital.Mock.Server.Services.Interfaces;
using Microsoft.IdentityModel.Tokens;
using System.Net.Http;
using Newtonsoft.Json;
using Serilog;
using Microsoft.Extensions.Options;
using System.Threading;

namespace Orbital.Mock.Server.Services
{
    /// <summary>
    /// A simple class used to parse data from an identity server configuraiton endpoint,
    /// specifically to isolate the jwks_url property.
    /// </summary>
    class OpenIdConfig { public string jwks_uri; }


    public class PublicKeyServiceConfig
    {
        /// <summary>
        /// The url to use when trying to retrieve jwks from an identity server
        /// </summary>
        public string JWKS_ENDPOINT { get; set; }

        /// <summary>
        /// How long the public keys should be cached for before they are re-loaded
        /// </summary>
        public string CACHE_TIME_HOURS { get; set; }
    }


    /// <summary>
    /// A service used to retrieve and cache public keys in the JWK format.
    /// </summary>
    public class PublicKeyService : IPublicKeyService
    {
        /// <summary>
        /// The configuration section name for the configuration variables of this service
        /// </summary>
        public const string CFG_SEC_NAME = "PUB_KEYS";

        /// <summary>
        /// The Dictionary where the JsonWebKeys are cached.
        /// It maps from the Key ID to the JsonWebKey object.
        /// </summary>
        readonly Dictionary<string, JsonWebKey> KeyCache = new();

        /// <summary>
        /// The timestamp of when the current cached data expires (in UTC)
        /// </summary>
        DateTime? CacheExpiryTime = null;

        /// <summary>
        /// The HTTP Client used to get data from the identity server endpoint
        /// </summary>
        readonly HttpClient client;

        /// <summary>
        /// The fallback value for how long to cache keys for (in hours)
        /// </summary>
        const int DEFAULT_CACHE_TIME = 12;

        /// <summary>
        /// How long the public keys should be cached for (in hours) before they are re-loaded
        /// </summary>
        readonly int CACHE_TIME_HOURS;

        /// <summary>
        /// The configuraiton object passed in to the constructor
        /// </summary>
        readonly PublicKeyServiceConfig _cfg;

        /// <summary>
        /// Lock used to prevent race conditions when accessing the internal cache
        /// </summary>
        readonly ReaderWriterLockSlim cacheLock = new();


        /// <summary>
        /// Creates a new PublicKeyService object
        /// </summary>
        /// <param name="options">The configuraiton opions</param>
        /// <param name="httpClient">A clinet used to make HTTP requests</param>
        public PublicKeyService(IOptions<PublicKeyServiceConfig> options, HttpClient httpClient = null)
        {
            client = httpClient ?? new HttpClient();

            _cfg = options.Value;

            try { CACHE_TIME_HOURS = int.Parse(_cfg.CACHE_TIME_HOURS); }
            catch (Exception) { CACHE_TIME_HOURS = DEFAULT_CACHE_TIME; }
        }


        /// <summary>
        /// Gets a JsonWebKey from any configured sources by looking it up by its Key ID
        /// </summary>
        /// <param name="keyId">The ID of the JsonWebKey</param>
        /// <returns>A JsonWebKey object or null if there is no key associated to the provided key id</returns>
        public JsonWebKey GetKey(string keyId)
        {
            MaybeRefreshKeys();

            cacheLock.EnterReadLock();
            try
            {
                return KeyCache.TryGetValue(keyId, out JsonWebKey key) ? key : null;
            }
            finally
            {
                cacheLock.ExitReadLock();
            }
        }

        /// <summary>
        /// Gets a JsonWebKey from any configured sources by looking it up by its Key ID
        /// </summary>
        /// <param name="token">The String representation of the token that is being validated.</param>
        /// <param name="securityToken">The SecurityToken that is being validated. It may be null.</param>
        /// <param name="kid">A key identifier. It may be null.</param>
        /// <param name="validationParameters">TokenValidationParameters required for validation.</param>
        /// <returns>Valid SecurityKey(s) to use when validating a signature.</returns>
        public IEnumerable<SecurityKey> IssuerSigningKeyResolver(string token, SecurityToken securityToken, string kid, TokenValidationParameters validationParameters)
        {
            var result = new List<SecurityKey>();

            var key = GetKey(kid);
            if (key is not null) { result.Add(key); }

            return result;
        }

        /// <summary>
        /// Refreshes the key cache when it is expired
        /// </summary>
        /// <returns>A void task</returns>
        void MaybeRefreshKeys()
        {
            cacheLock.EnterUpgradeableReadLock();
            try
            {
                DateTime now = DateTime.UtcNow;
                if (CacheExpiryTime is null || now > CacheExpiryTime)
                {
                    cacheLock.EnterWriteLock();
                    try
                    {
                        CacheExpiryTime = now.AddHours(CACHE_TIME_HOURS);
                        KeyCache.Clear();

                        LoadKeysFromEndpoint();
                    }
                    finally
                    {
                        cacheLock.ExitWriteLock();
                    }
                }
            }
            finally
            {
                cacheLock.ExitUpgradeableReadLock();
            }
        }

        /// <summary>
        /// Tries to load keys from an identity server whose url is provided by an environment variable
        /// </summary>
        /// <returns></returns>
        void LoadKeysFromEndpoint()
        {
            if (_cfg.JWKS_ENDPOINT is null || _cfg.JWKS_ENDPOINT == string.Empty) { return; }

            var endpointRawData = GetEndpointData(_cfg.JWKS_ENDPOINT);

            try
            {
                // If we are provided with an openid configuration, get the jwks_uri and try to get the jwks from there
                var serlialized = JsonConvert.DeserializeObject<OpenIdConfig>(endpointRawData);
                if (serlialized.jwks_uri is not null)
                {
                    endpointRawData = GetEndpointData(serlialized.jwks_uri);
                }
            }
            catch (Exception ex)
            {
                Log.Warning(ex, "Data from the jwks endpoint failed to de-serialize");
            }

            try
            {
                foreach (var key in new JsonWebKeySet(endpointRawData).Keys)
                {
                    if (key.Kid is not null) { KeyCache.Add(key.Kid, key); }
                }
            }
            catch (Exception ex)
            {
                Log.Warning(ex, "JSON data from the jwks endpoint failed to de-serialize");
            }
        }

        /// <summary>
        /// Tries to get the data from the JWKs endpoint, if the process fails, null is returned.
        /// </summary>
        /// <returns>A string containing the data returned from the endpoint or null if there was an exception</returns>
        string GetEndpointData(string url)
        {
            try
            {
                var stringTask = client.GetStringAsync(url);
                stringTask.Wait();
                return stringTask.Result;
            }
            catch (Exception ex)
            {
                Log.Error(ex, "Failed to get data from the JWKs endpoint: {Url}", url);
                return null;
            }
        }

        ~PublicKeyService()
        {
            if (cacheLock != null) cacheLock.Dispose();
        }
    }
}
