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
        public BodyRule(BodyRuleTypes Type = BodyRuleTypes.BodyEquality, String Rule = null)
        {
            this.Rule = Rule == null ? String.Empty : Rule;
            this.Type = Type;
        }
        [JsonProperty("rule")]
        public String Rule { get; set; }
        [JsonProperty("type")]
        public BodyRuleTypes Type { get; set; }

        [JsonIgnore]
        public JObject JsonRule
        {
            get
            {
                try
                {
                    return JObject.Parse(Rule);
                }
                catch (JsonReaderException e)
                {
                    return new JObject();
                }
            }
        }

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
                return JObject.DeepEquals(obj, this.JsonRule);
            }
            catch (JsonReaderException e)
            {
                return JObject.DeepEquals(new JObject(), this.JsonRule);
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
                JObject.DeepEquals(this.JsonRule, other.JsonRule);
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(Type, Rule);
        }
    }
}
