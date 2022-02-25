using System;
using System.Collections.Generic;

using Microsoft.OpenApi.Models;

using Newtonsoft.Json;

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

        [JsonProperty("metadata")]
        public Metadata Metadata { get; set; }

        [JsonProperty("openApi")]
        public OpenApiDocument OpenApi { get; set; }

        [JsonProperty("scenarios")]
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
                   EqualityComparer<Metadata>.Default.Equals(Metadata, other.Metadata) &&
                   EqualityComparer<List<Scenario>>.Default.Equals(Scenarios, other.Scenarios) &&
                   EqualityComparer<bool>.Default.Equals(TokenValidation, other.TokenValidation);
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(Host, Metadata, Scenarios, TokenValidation);
        }
    }
}
