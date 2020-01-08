using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Orbital.Mock.Server.Models.Converters;
using Orbital.Mock.Server.Models.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Orbital.Mock.Server.Models
{
    public class BodyRule : IEquatable<BodyRule>, IRule
    {
        /// <summary>
        /// BodyRule Constructor With Optional Parameters
        /// </summary>
        /// <param name="RuleType">Enum representing the type of Body Rule created</param>
        /// <param name="RuleValue">The Json object used to compare against request bodies for matching</param>
        public BodyRule(Type Type = null,JToken RuleValue = null)
        {
            this.RuleValue = RuleValue == null ? new JObject() : RuleValue;
            this.RuleType = RuleType;
        }
        [JsonProperty("rule")]
        public JToken RuleValue { get; set; }
        [JsonProperty("type")]
        public BodyRuleTypes RuleType { get; set; }

        public Type ComparerType { get; set; }

        public override bool Equals(object obj)
        {
            return Equals(obj as BodyRule);
        }

        public bool Equals(BodyRule other)
        {
            return other != null &&
                this.RuleType == other.RuleType &&
                JObject.DeepEquals(this.RuleValue, other.RuleValue);
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(RuleType, RuleValue);
        }
    }
}
