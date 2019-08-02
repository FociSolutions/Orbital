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
            var obj = JObject.Parse(json);
            return this.Rule.ToString().Equals(obj.ToString());
        }

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
