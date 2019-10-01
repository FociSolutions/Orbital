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
        public MockResponse(int Status = StatusCodes.Status400BadRequest, string Body = null, IDictionary<string, string> Headers = null,
                            IDictionary<string, string> Queries = null)
        {
            if (Body == null)
            {
                Body = ReasonPhrases.GetReasonPhrase(StatusCodes.Status400BadRequest);
            }

            if (Headers == null)
            {
                Headers = new Dictionary<string, string>();
            }

            if (Queries == null)
            {
                Queries = new Dictionary<string, string>();
            }

            this.Status = Status;
            this.Body = Body;
            this.Headers = Headers;
            this.Queries = Queries;
        }

        [JsonProperty("status")]
        public int Status { get; set; }
        [JsonProperty("body")]
        public string Body { get; set; }
        [JsonProperty("headers")]
        public IDictionary<string, string> Headers { get; set; }
        [JsonProperty("query")]
        public IDictionary<string, string> Queries { get; set; }

        public override bool Equals(object obj)
        {
            return this.Equals(obj as MockResponse);
        }

        public bool Equals(MockResponse other)
        {
            return other != null &&
                   Status == other.Status &&
                   Body.Equals(other.Body) &&
                   this.Headers.Count == other.Headers.Count && !Headers.Except(other.Headers).Any() &&
                   this.Queries.Count == other.Queries.Count && !Queries.Except(other.Queries).Any();
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(Status, Body, Headers, Queries);
        }
    }


}
