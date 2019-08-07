using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.WebUtilities;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Orbital.Mock.Server.Models
{
    public class MockResponse : IEquatable<MockResponse>
    {
        /// <summary>
        /// Constructor, defaults to a 404 response
        /// </summary>
        public MockResponse(int Status = StatusCodes.Status404NotFound, string Body = null, IDictionary<string, string> Headers = null)
        {
            if (Body == null)
            {
                Body = ReasonPhrases.GetReasonPhrase(StatusCodes.Status404NotFound);
            }

            if (Headers == null)
            {
                Headers = new Dictionary<string, string>();
            }

            this.Status = Status;
            this.Body = Body;
            this.Headers = Headers;
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
