using System.IO;

using Microsoft.OpenApi.Models;
using Microsoft.OpenApi.Readers.Exceptions;

using Orbital.Mock.Definition.Converters;

using Xunit;
using Newtonsoft.Json;

namespace Orbital.Mock.Definition.Tests.Converters
{
    public class OpenApiJsonConverterTests
    {
        [Fact]
        public void ReadJsonSuccessTest()
        {
            #region TestSetup
            var input = new
            {
                jsonReader = new JsonTextReader(new StringReader("{\"swagger\":\"2.0\",\"info\":{\"title\":\"This is a simple example\",\"version\":\"1.0.0\"},\"host\":\"example.org\",\"basePath\":\"/api\",\"schemes\":[\"http\",\"https\"],\"paths\":{}}")),
                objectType = typeof(OpenApiDocument),
            };
            #endregion
            var Target = new OpenApiJsonConverter();
            var Actual = Target.ReadJson(input.jsonReader, input.objectType, null, null);
            Assert.IsType<OpenApiDocument>(Actual);
        }

        [Fact]
        public void ReadJsonFailTest()
        {
            #region TestSetup
            var input = new
            {
                jsonReader = new JsonTextReader(new StringReader("{\"invalidKey\": \"1.0\"}")),
                objectType = typeof(OpenApiDocument),
            };
            #endregion
            var Target = new OpenApiJsonConverter();
            Assert.Throws<OpenApiUnsupportedSpecVersionException>(() => Target.ReadJson(input.jsonReader, input.objectType, null, null));
        }

        [Fact]
        public void WriteJsonSuccessTest()
        {
            #region TestSetup
            var stringWriter = new StringWriter();
            var input = new
            {
                jsonWriter = new JsonTextWriter(stringWriter),
                openApiDocument = new OpenApiDocument(),
                openApiTag = new OpenApiTag() { Name = "openapi", Description= "OpenApi2_0" }
            };
            input.openApiDocument.Tags.Add(input.openApiTag);
            #endregion
            var Target = new OpenApiJsonConverter();
            Target.WriteJson(input.jsonWriter, input.openApiDocument, null);
            var Actual = stringWriter.ToString();

            var Expected = "{\"swagger\":\"2.0\",\"info\":{},\"paths\":{},\"tags\":[{\"name\":\"openapi\",\"description\":\"OpenApi2_0\"}]}";

            Assert.Equal(Expected, Actual);
        }

        [Fact]
        public void WriteJsonNullFailTest()
        {
            #region TestSetup
            var stringWriter = new StringWriter();
            var input = new
            {
                jsonWriter = new JsonTextWriter(stringWriter),
            };
            #endregion
            var Target = new OpenApiJsonConverter();
            Target.WriteJson(input.jsonWriter, null, null);
            var Actual = stringWriter.ToString();

            var Expected = "";

            Assert.Equal(Expected, Actual);
        }

        [Fact]
        public void WriteJsonInvalidTypeFailTest()
        {
            #region TestSetup
            var stringWriter = new StringWriter();
            var input = new
            {
                jsonWriter = new JsonTextWriter(stringWriter),
                testObject = new { InvalidKey = "invalidKey" }
            };
            #endregion
            var Target = new OpenApiJsonConverter();
            Target.WriteJson(input.jsonWriter, input.testObject, null);
            var Actual = stringWriter.ToString();

            var Expected = "";

            Assert.Equal(Expected, Actual);
        }

        [Fact]
        public void CanConvertSuccessTest()
        {
            var Target = new OpenApiJsonConverter();
            var Actual = Target.CanConvert(typeof(OpenApiDocument));
            Assert.True(Actual);
        }

        [Fact]
        public void CanConvertFailTest()
        {
            var Target = new OpenApiJsonConverter();
            var Actual = Target.CanConvert(typeof(object));
            Assert.False(Actual);
        }
    }
}
