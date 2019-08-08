using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Orbital.Mock.Server.Models
{
    public class RequestMatchRules : IEquatable<RequestMatchRules>
    {
        [JsonProperty("headerRules")]
        public IDictionary<string, string> HeaderRules { get; set; }
        [JsonProperty("queryRules")]
        public IDictionary<string, string> QueryRules { get; set; }
        [JsonProperty("bodyRules")]
        public ICollection<BodyRule> BodyRules { get; set; }

        public override bool Equals(object obj)
        {
            return this.Equals(obj as RequestMatchRules);
        }

        public bool Equals(RequestMatchRules other)
        {
            return other != null &&
                this.HeaderRules.Count == other.HeaderRules.Count && !HeaderRules.Except(other.HeaderRules).Any() &&
                QueryRules.Count == other.QueryRules.Count && !QueryRules.Except(other.QueryRules).Any() &&
                BodyRules.Count == other.BodyRules.Count && other.BodyRules.All(br1 => BodyRules.Any(br2 => br1.Equals(br2)));
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(HeaderRules, QueryRules, BodyRules);
        }
    }
}
