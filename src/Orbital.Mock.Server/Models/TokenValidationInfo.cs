using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Orbital.Mock.Server.Models
{
    public class TokenValidationInfo
    {
        [JsonProperty("validate")]
        public bool Validate { get; set; } = false;

        [JsonProperty("key")]
        public string Key { get; set; } = "";

        public override bool Equals(object obj)
        {
            return Equals(obj as TokenValidationInfo);
        }

        public bool Equals(TokenValidationInfo other)
        {
            return other != null &&
                   Validate == other.Validate &&
                   Key == other.Key;
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(Validate, Key);
        }
    }
}
