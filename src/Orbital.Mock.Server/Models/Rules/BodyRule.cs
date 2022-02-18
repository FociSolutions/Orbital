using System;

using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Orbital.Mock.Server.Models.Interfaces;

namespace Orbital.Mock.Server.Models.Rules
{
    public class BodyRule : IEquatable<BodyRule>, IRule
    {
        /// <summary>
        /// Construct a new BodyRule
        /// </summary>
        /// <param name="ruleType">Desired ComparerType for resultant BodyRule</param>
        /// <param name="value">Expected body content - string can contain 'stringified' JSON or text</param>
        public BodyRule(ComparerType ruleType, string value)
        {
            this.Type = ruleType;
            this.Value = (value != null) ? value : new JObject().ToString();
        }

        /// <summary>
        /// Construct a new BodyRule from input ComparerType and JSON Token
        /// </summary>
        /// <param name="ruleType">Desired ComparerType for resultant BodyRul</param>
        /// <param name="value">JSON body content - will be stored as indented string</param>
        public BodyRule(ComparerType ruleType, JToken value)
            : this(ruleType, value.ToString())
        { }

        [JsonProperty("value")]
        public string Value { get; set; }
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
                this.Value.Equals(other.Value);
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(Type, Value);
        }
    }
}
