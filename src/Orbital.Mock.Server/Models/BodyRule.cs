using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Orbital.Mock.Server.Models
{
    public class BodyRule : IEquatable<BodyRule>
    {
        public BodyRule(BodyRuleTypes Type = BodyRuleTypes.BodyEquality, JObject Rule = null)
        {
            this.Rule = Rule == null ? JObject.FromObject(new { }) : Rule;
            this.Type = Type;
        }
        [JsonProperty("rule")]
        public JObject Rule { get; set; }
        [JsonProperty("type")]
        public BodyRuleTypes Type { get; set; }

        /// <summary>
        /// Method returns true if the json string matches the Rule property
        /// </summary>
        /// <param name="json"></param>
        /// <returns></returns>
        public bool IsMatch(string json)
        {
            try
            {
                var obj = JObject.Parse(json);
                return this.Rule.ToString().Equals(obj.ToString());
            }
            catch (JsonReaderException e)
            {
                return false;
            }
        }

        public override bool Equals(object obj)
        {
            return Equals(obj as BodyRule);
        }

        public bool Equals(BodyRule other)
        {
            return other != null &&
                this.Type == other.Type &&
                this.Rule.ToString().Equals(other.Rule.ToString());
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(Type, Rule);
        }
    }
}
