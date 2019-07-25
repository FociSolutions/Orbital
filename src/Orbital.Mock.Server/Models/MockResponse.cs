using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Orbital.Mock.Server.Models
{
    public class MockResponse : IEquatable<MockResponse>
    {
        [JsonProperty("status")]
        public int Status { get; set; }
        [JsonProperty("body")]
        public string Body { get; set; }
        [JsonProperty("headers")]
        public Dictionary<string, string> Headers { get; set; }

        public override bool Equals(object obj)
        {
            return this.Equals(obj as MockResponse);
        }

        public bool Equals(MockResponse other)
        {
            return other != null &&
                   Status == other.Status &&
                   Body == other.Body &&
                   EqualityComparer<Dictionary<string, string>>.Default.Equals(Headers, other.Headers);
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(Status, Body, Headers);
        }
    }


}
