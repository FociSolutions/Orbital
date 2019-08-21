using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Orbital.Mock.Server.Models.Converters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Orbital.Mock.Server.Models
{
    public class BodyRule : IEquatable<BodyRule>
    {
        /// <summary>
        /// BodyRule Constructor With Optional Parameters
        /// </summary>
        /// <param name="Type">Enum representing the type of Body Rule created</param>
        /// <param name="Rule">The Json object used to compare against request bodies for matching</param>
        public BodyRule(BodyRuleTypes Type = BodyRuleTypes.BodyEquality, JObject Rule = null)
        {
            this.Rule = Rule == null ? new JObject() : Rule;
            this.Type = Type;
        }
        [JsonProperty("rule")]
        public JObject Rule { get; set; }
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
                JObject.DeepEquals(this.Rule, other.Rule);
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(Type, Rule);
        }
    }
}
