using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.WebUtilities;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Orbital.Mock.Server.Models
{
    public class MockResponse : IEquatable<MockResponse>
    {
        /// <summary>
        /// Constructor, defaults to a 404 response
        /// </summary>
        public MockResponse()
        {
            Status = StatusCodes.Status404NotFound;
            Body = ReasonPhrases.GetReasonPhrase(StatusCodes.Status404NotFound);
            Headers = new Dictionary<string, string>();
        }

        public MockResponse(int Status)
        {
            this.Status = Status;
            this.Headers = new Dictionary<string, string>();
            Body = ReasonPhrases.GetReasonPhrase(Status);
        }

        public MockResponse(int Status, IDictionary<string, string> Headers)
        {
            this.Status = Status;
            this.Headers = Headers;
            Body = ReasonPhrases.GetReasonPhrase(Status);
        }

        public MockResponse(int Status, IDictionary<string, string> Headers, string Body)
        {
            this.Status = Status;
            this.Headers = Headers;
            this.Body = Body;
        }

        [JsonProperty("status")]
        public int Status { get; set; }
        [JsonProperty("body")]
        public string Body { get; set; }
        [JsonProperty("headers")]
        public IDictionary<string, string> Headers { get; set; }

        public override bool Equals(object obj)
        {
            return this.Equals(obj as MockResponse);
        }

        public bool Equals(MockResponse other)
        {
            return other != null &&
                   Status == other.Status &&
                   Body.Equals(other.Body) &&
                   this.Headers.Count == other.Headers.Count && !Headers.Except(other.Headers).Any();
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(Status, Body, Headers);
        }
    }


}
