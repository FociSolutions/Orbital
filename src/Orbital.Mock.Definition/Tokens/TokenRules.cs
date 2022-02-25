using System;
using System.Collections.Generic;

using Newtonsoft.Json;

using Orbital.Mock.Definition.Rules;

namespace Orbital.Mock.Definition.Tokens
{
    public class TokenRules
    {
        [JsonProperty("checkExpired")]
        public bool CheckExpired { get; set; } = false;

        [JsonProperty("validationType")]
        public TokenValidationType ValidationType { get; set; } = TokenValidationType.NONE;

        [JsonProperty("rules")]
        public ICollection<KeyValueTypeRule> Rules { get; set; }

        public override bool Equals(object obj)
        {
            return Equals(obj as TokenRules);
        }

        public bool Equals(TokenRules other)
        {
            return other != null &&
                   CheckExpired == other.CheckExpired &&
                   ValidationType == other.ValidationType &&
                   Rules == other.Rules;
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(CheckExpired, ValidationType, Rules);
        }
    }
}
