using Microsoft.OpenApi.Models;
using Microsoft.OpenApi.Readers;
using Microsoft.OpenApi.Writers;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace Orbital.Mock.Server.Models.Converters
{
    public class OpenApiConverter : JsonConverter
    {
        public override bool CanConvert(Type objectType)
        {
            return objectType == typeof(OpenApiDocument);
        }

        public override bool CanWrite => true;

        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
        {
            var openApiStringReader = new OpenApiStringReader();
            var openApiString = JObject.Load(reader).ToString();
            var openApiDocument = openApiStringReader.Read(openApiString, out var diagnostic);
            return openApiDocument;
        }

        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {
            var openApi = value as OpenApiDocument;

            if (openApi != null)
            {
                WriteJson(writer, openApi);
            }
        }

        private static void WriteJson(JsonWriter writer, OpenApiDocument openApi)
        {
            using (var memory = new StringWriter())
            {
                writer.Flush();
                var openApiWriter = new OpenApiJsonWriter(memory);
                var openApiJson = string.Empty;
                openApi.SerializeAsV2(openApiWriter);
                var json = JObject.Parse(memory.ToString());
                json.WriteTo(writer);
            }
        }
    }
}
