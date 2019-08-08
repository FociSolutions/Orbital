using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Orbital.Mock.Server.Models
{
    public class BodyRule : IEquatable<BodyRule>
    {

        [JsonProperty("rule")]
        public string Rule { get; set; }
        [JsonProperty("type")]
        public BodyRuleTypes Type { get; set; }

        public override bool Equals(object obj)
        {
            return Equals(obj as BodyRule);
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
