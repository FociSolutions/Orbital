using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;

namespace Orbital.Mock.Server.Tests
{
    /// <summary>
    /// Used to mock responses from the HttpClient class
    /// Based on the article "Mocking the HttpClient in .NET Core (with NSubstitute)" by Lars Richter:
    /// https://dev.to/n_develop/mocking-the-httpclient-in-net-core-with-nsubstitute-k4j
    /// </summary>
    public class MockHttpMessageHandler : HttpMessageHandler
    {
        private readonly string response;
        private readonly HttpStatusCode statusCode;
        private readonly Dictionary<string, (string response, HttpStatusCode statusCode)> responseMap;

        public string Input { get; private set; }
        public int NumberOfCalls { get; private set; }

        public MockHttpMessageHandler(string response, HttpStatusCode statusCode = HttpStatusCode.OK)
        {
            this.response = response;
            responseMap = null;
            this.statusCode = statusCode;
        }

        public MockHttpMessageHandler()
        {
            response = null;
            responseMap = new();
            statusCode = HttpStatusCode.OK;
        }

        public void AddResponse(string requestUri, string response, HttpStatusCode statusCode = HttpStatusCode.OK)
        {
            if (responseMap is not null)
            {
                responseMap.Add(requestUri, (response, statusCode));
            }
        }

        public void ClearResponses()
        {
            responseMap.Clear();
        }

        public void ResetNumberOfCalls() { NumberOfCalls = 0; }

        protected override async Task<HttpResponseMessage> SendAsync(
            HttpRequestMessage request,
            CancellationToken cancellationToken)
        {
            NumberOfCalls++;
            if (request.Content != null) // Could be a GET-request without a body
            {
                Input = await request.Content.ReadAsStringAsync(CancellationToken.None);
            }

            string response = this.response;
            HttpStatusCode statusCode = this.statusCode;

            if (responseMap is not null && responseMap.TryGetValue(request.RequestUri.OriginalString, out (string response, HttpStatusCode statusCode) entry))
            {
                response = entry.response;
                statusCode = entry.statusCode;
            }
            else if (response is null)
            {
                throw new ArgumentException("No response found for the given request uri");
            }

            return new HttpResponseMessage
            {
                StatusCode = statusCode,
                Content = new StringContent(response)
            };
        }
    }
}
