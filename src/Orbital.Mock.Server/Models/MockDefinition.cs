﻿
using Microsoft.OpenApi.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;

namespace Orbital.Mock.Server.Models
{
    public class MockDefinition : IEquatable<MockDefinition>
    {
        [JsonProperty("host")]
        public string Host { get; set; }

        [JsonProperty("basePath", DefaultValueHandling = DefaultValueHandling.Ignore)]
        public string BasePath { get; set; }

        [JsonProperty("metadata")]
        public MetadataInfo Metadata { get; set; }

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
                   EqualityComparer<MetadataInfo>.Default.Equals(Metadata, other.Metadata);
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(Host, Metadata);
        }
    }
}
