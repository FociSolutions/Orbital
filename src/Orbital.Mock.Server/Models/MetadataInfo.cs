
using Newtonsoft.Json;
using System;
namespace Orbital.Mock.Server.Models
{
    public class MetadataInfo 
    {
        [JsonProperty("title")]
        public string Title { get; set; }
        [JsonProperty("description")]
        public string Description { get; set; }
    }
}
