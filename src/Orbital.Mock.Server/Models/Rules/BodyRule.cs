using System;

using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Orbital.Mock.Server.Models.Interfaces;

namespace Orbital.Mock.Server.Models.Rules
{
    public class BodyRule : IEquatable<BodyRule>, IRule
    {
        /// <summary>
        /// BodyRule Constructor
        /// </summary>
        /// <param name="RuleType">Enum representing the type of Body Rule created</param>
        /// <param name="RuleValue">The Json object used to compare against request bodies for matching</param>
        public BodyRule(ComparerType RuleType, JToken RuleValue)
        {
            this.RuleValue = RuleValue == null ? new JObject() : RuleValue;
            this.Type = RuleType;
        }

        [JsonProperty("rule")]
        public JToken RuleValue { get; set; }
        [JsonProperty("type")]
        public ComparerType Type { get; set; }

        public override bool Equals(object obj)
        {
            return Equals(obj as BodyRule);
        }

        public bool Equals(BodyRule other)
        {
            return other != null &&
                this.Type == other.Type &&
                JObject.DeepEquals(this.RuleValue, other.RuleValue);
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(Type, RuleValue);
        }
    }
}
