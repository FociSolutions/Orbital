using Newtonsoft.Json;
using Orbital.Mock.Server.Models.Rules;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Orbital.Mock.Server.Models
{
    public class RequestMatchRules : IEquatable<RequestMatchRules>
    {
        [JsonProperty("urlRules")]
        public ICollection<PathTypeRule> UrlRules { get; set; }
        [JsonProperty("headerRules")]
        public ICollection<KeyValueTypeRule> HeaderRules { get; set; }
        [JsonProperty("queryRules")]
        public ICollection<KeyValueTypeRule> QueryRules { get; set; }
        [JsonProperty("bodyRules")]
        public ICollection<BodyRule> BodyRules { get; set; }

        public override bool Equals(object obj)
        {
            return this.Equals(obj as RequestMatchRules);
        }

        public bool Equals(RequestMatchRules other)
        {
            return other != null &&
                UrlRules.Count() == other.UrlRules.Count() && !UrlRules.Except(other.UrlRules).Any() &&
                HeaderRules.Count() == other.HeaderRules.Count() && !HeaderRules.Except(other.HeaderRules).Any() &&
                QueryRules.Count() == other.QueryRules.Count() && !QueryRules.Except(other.QueryRules).Any() &&
                BodyRules.Count() == other.BodyRules.Count() && other.BodyRules.All(br1 => BodyRules.Any(br2 => br1.Equals(br2)));
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(UrlRules, HeaderRules, QueryRules, BodyRules);
        }
    }
}
