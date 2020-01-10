using Newtonsoft.Json;
using Orbital.Mock.Server.Models.Interfaces;
using System.Collections.Generic;

namespace Orbital.Mock.Server.Models.Rules
{
    public class KeyValuePairRule : IRule
    {
        /// <summary>
        /// KeyValuePairRule Constructor With Parameters
        /// </summary>
        /// <param name="RuleType">Enum representing the type of Body Rule created</param>
        /// <param name="RuleValue">The Key/Value pair used to compare against the request for matching</param>
        public KeyValuePairRule(ComparerType RuleType, KeyValuePair<string, string> RuleValue)
        {
            this.RuleValue = RuleValue;
            this.Type = RuleType;
        }

        [JsonProperty("rule")]
        public KeyValuePair<string, string> RuleValue = new KeyValuePair<string, string>();

        [JsonProperty("type")]
        public ComparerType Type { get; set; }

    }
}
