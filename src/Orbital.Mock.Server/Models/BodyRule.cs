using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Orbital.Mock.Server.Models
{
    public class BodyRule : IEquatable<BodyRule>
    {
        /// <summary>
        /// Constructor for the body rule model
        /// </summary>
        /// <param name="type"></param>
        /// <param name="rule"></param>
        public BodyRule(BodyRuleTypes type, string rule)
        {
            this.Type = type;
            this.Rule = rule;
        }
        [JsonProperty("rule")]
        public string Rule { get; }
        [JsonProperty("type")]
        public BodyRuleTypes Type { get; }

        public override bool Equals(object obj)
        {
            return this.Equals(obj as RequestMatchRules);
        }

        public bool Equals(BodyRule other)
        {
            return other != null &&
                this.Type == other.Type &&
                this.Rule.Equals(other.Rule);
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(Type, Rule);
        }
    }
}
