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

        /// <summary>
        /// Method returns true if the json string matches the Rule property
        /// </summary>
        /// <param name="json">The json string of the request body to match against</param>
        /// <returns>True if the json in the string matches the Rule JObject, false otherwise</returns>
        public bool IsMatch(string json)
        {
            try
            {
                var obj = JObject.Parse(json);
                return JObject.DeepEquals(obj, this.Rule);
            }
            catch (JsonReaderException e)
            {
                return JObject.DeepEquals(new JObject(), this.Rule);
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
                JObject.DeepEquals(this.Rule, other.Rule);
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(Type, Rule);
        }
    }
}
