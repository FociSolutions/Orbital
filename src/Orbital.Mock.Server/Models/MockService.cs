
using Newtonsoft.Json;
using System;
namespace Orbital.Mock.Server.Models
{
    public class MockDefinition 
    {
        [JsonProperty("host")]
        public string Host { get; set; }

        [JsonProperty("metadata")]
        public MetadataInfo Metadata { get; set; }
    }
}
