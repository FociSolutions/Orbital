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
    /// <summary>
    /// Json Converter for the Microsoft.OpenApi.OpenApiDocument model
    /// </summary>
    public class OpenApiJsonConverter : JsonConverter
    {
        /// <summary>
        /// Checks that the given object type is able to be converted. In this case the object type must be 
        /// an OpenApiDocument. Returns true if it is, false otherwise
        /// </summary>
        /// <param name="objectType">Type of the object to check against</param>
        public override bool CanConvert(Type objectType)
        {
            return objectType == typeof(OpenApiDocument);
        }

        /// <summary>
        /// Reads json into an OpenApiDocument Object using the OpenApiStringReader from Microsoft.OpenApi.Readers
        /// </summary>
        /// <param name="reader">The JsonReader that reads the incoming json</param>
        /// <returns></returns>
        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
        {
            var openApiStringReader = new OpenApiStringReader();
            var openApiString = JObject.Load(reader).ToString();
            var openApiDocument = openApiStringReader.Read(openApiString, out var diagnostic);
            return openApiDocument;
        }

        /// <summary>
        /// Writes an Object into JSON using the OpenApiJsonWriter from Microsoft.OpenApi.Writers
        /// This method only casts the object into an OpenApiDocument, checks if its not null and
        /// passes it to the WriteJson method to do the actual conversion if its not null.
        /// </summary>
        /// <param name="writer">The JsonWriter used to write the json output</param>
        /// <param name="value">The object to turn into Json</param>
        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {
            var openApi = value as OpenApiDocument;

            if (openApi != null)
            {
                WriteJson(writer, openApi);
            }
        }

        /// <summary>
        /// The method that writes the OpenApiDocument into JSOn using the OpenApiJsonWriter from Microsoft.OpenApi.Writers
        /// </summary>
        /// <param name="writer">The JsonWriter used to write the json output</param>
        /// <param name="openApi">The OpenApiDocument Object to turn into Json</param>
        private static void WriteJson(JsonWriter writer, OpenApiDocument openApi)
        {
            using (var memory = new StringWriter())
            {
                writer.Flush();
                var openApiWriter = new OpenApiJsonWriter(memory);
                openApi.SerializeAsV2(openApiWriter);
                var json = JObject.Parse(memory.ToString());
                json.WriteTo(writer);
            }
        }
    }
}
