using Newtonsoft.Json;
using Orbital.Mock.Server.Models.Rules;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Orbital.Mock.Server.Models
{
    public class TokenRuleInfo
    {
        [JsonProperty("checkExpired")]
        public bool CheckExpired { get; set; } = false;

        [JsonProperty("validationType")]
        public TokenValidationType ValidationType { get; set; } = TokenValidationType.NONE;

        [JsonProperty("rules")]
        public ICollection<KeyValuePairRule> Rules { get; set; }

        public override bool Equals(object obj)
        {
            return Equals(obj as TokenRuleInfo);
        }

        public bool Equals(TokenRuleInfo other)
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
