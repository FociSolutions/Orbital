
using Newtonsoft.Json;
using System;
using System.Collections.Generic;

namespace Orbital.Mock.Server.Models
{
    public class MockDefinition : IEquatable<MockDefinition>
    {
        [JsonProperty("host")]
        public string Host { get; set; }

        [JsonProperty("metadata")]
        public MetadataInfo Metadata { get; set; }

        public override bool Equals(object obj)
        {
            return Equals(obj as MockDefinition);
        }

        public bool Equals(MockDefinition other)
        {
            return other != null &&
                   Host == other.Host &&
                   EqualityComparer<MetadataInfo>.Default.Equals(Metadata, other.Metadata);
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(Host, Metadata);
        }
    }
}
