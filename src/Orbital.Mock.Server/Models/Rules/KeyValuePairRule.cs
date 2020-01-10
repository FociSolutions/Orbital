using Newtonsoft.Json;
using Orbital.Mock.Server.Converters;
using Orbital.Mock.Server.Models.Interfaces;
using System.Collections.Generic;

namespace Orbital.Mock.Server.Models.Rules
{
    public class KeyValuePairRule : IRule
    {
        [JsonConverter(typeof(KeyValueConverter))]
        [JsonProperty("rule")]
        public KeyValuePair<string, string> RuleValue { get; set; }

        [JsonProperty("type")]
        public ComparerType Type { get; set; }

    }
}
