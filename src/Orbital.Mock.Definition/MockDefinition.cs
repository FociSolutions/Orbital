
using System;
using System.IO;
using System.Collections.Generic;

using Microsoft.OpenApi.Models;

using Newtonsoft.Json;
using Serilog;

namespace Orbital.Mock.Definition
{
    public class MockDefinition : IEquatable<MockDefinition>
    {
        [JsonProperty("host")]
        public string Host { get; set; }

        [JsonProperty("basePath", DefaultValueHandling = DefaultValueHandling.Ignore)]
        public string BasePath { get; set; }

        [JsonProperty("tokenValidation")]
        public bool TokenValidation { get; set; }

        [JsonProperty("metadata", Required = Required.Always)]
        public MetadataInfo Metadata { get; set; }

        [JsonProperty("openApi", Required = Required.Always)]
        public OpenApiDocument OpenApi { get; set; }

        [JsonProperty("scenarios", Required = Required.AllowNull)]
        public List<Scenario> Scenarios { get; set; }

        public override bool Equals(object obj)
        {
            return Equals(obj as MockDefinition);
        }

        public bool Equals(MockDefinition other)
        {
            return other != null &&
                   Host == other.Host &&
                   BasePath == other.BasePath &&
                   EqualityComparer<OpenApiDocument>.Default.Equals(OpenApi, other.OpenApi) &&
                   EqualityComparer<MetadataInfo>.Default.Equals(Metadata, other.Metadata) &&
                   EqualityComparer<List<Scenario>>.Default.Equals(Scenarios, other.Scenarios) &&
                   EqualityComparer<bool>.Default.Equals(TokenValidation, other.TokenValidation);
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(Host, Metadata, Scenarios, TokenValidation);
        }

        /// <summary>
        /// Retrieves a JSON file from disk and converts it to a MockDefinition, returns null if the MockDefinition cannot be retireved or parsed
        /// </summary>
        /// <param name="fileName"></param>
        /// <returns></returns>
        public static MockDefinition CreateFromFile(string fileName)
        {
            try
            {
                var json = File.ReadAllText(fileName);
                return CreateFromJsonString(json);
            }
            catch (Exception e)
            {
                Log.Error(e, "Exception has been identified on filename: '{fileName}'", fileName);
            }

            return null;
        }

        /// <summary>
        /// Converts a JSON string containing a Mock Definition into an object of type MockDefinition, returns null if the MockDefinition cannot be parsed
        /// </summary>
        /// <param name="json"></param>
        /// <returns></returns>
        public static MockDefinition CreateFromJsonString(string json)
        {
            try
            {
                var result = JsonConvert.DeserializeObject<MockDefinition>(json);
                return (result is not null) ? result : throw new JsonSerializationException($"Failed to deserialize MockDefinition from JSON: {json}");
            }
            catch (Exception e) when (e is JsonSerializationException || e is JsonReaderException)
            {
                Log.Error(e, "Failed to parse Mock Definition from file '{Json}'", json);
            }
            
            return null;
        }
    }
}
