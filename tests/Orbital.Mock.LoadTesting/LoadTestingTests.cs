using Microsoft.Extensions.Logging;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Xunit;
using Xunit.Abstractions;

namespace Orbital.Mock.LoadTesting
{
    public class LoadTestingTests : IClassFixture<TestsFixture>
    {
        /// <summary>
        /// Only one server should be allowed to run at once
        /// </summary>

        private static readonly HttpClient client = new HttpClient();

        private readonly ILogger<LoadTestingTests> _logger;

        public LoadTestingTests(ITestOutputHelper testOutputHelper)
        {
            var loggerFactory = new LoggerFactory();
            loggerFactory.AddProvider(new XunitLoggerProvider(testOutputHelper));
            _logger = loggerFactory.CreateLogger<LoadTestingTests>();
        }

        [Fact]
        public void SendParallelRequestsTest()
        {
            TestsFixture.StartServer();
            var responses = new List<Task<HttpResponseMessage>>();

            for (var i = 0; i < 10000; i++)
            {
                var response = client.GetAsync(TestsFixture.ORBITAL_URL);
                responses.Add(response);
            }

            // ensure that every response was successful
            responses.ForEach(response => {
                _logger.LogError("Received response");
                response.Result.EnsureSuccessStatusCode();
            });

            TestsFixture.TryStopServer();
        }

        /// <summary>
        /// Sends the same mockdefinition multiple times to test the re-writing capability
        /// of the database
        /// </summary>
        [Fact]
        public void SendSameMockdefinitionMultipleTimesTest()
        {
            TestsFixture.StartServer();
            var responses = new List<Task<HttpResponseMessage>>();

            for (var i = 0; i < 1000; i++)
            {
                HttpRequestMessage requestMessage = new HttpRequestMessage(HttpMethod.Post, TestsFixture.ORBITAL_URL)
                {
                    Content = new StringContent(File.ReadAllText("./PetStoreBaseMockDefinition.json"), Encoding.UTF8, "application/json")
                };

                responses.Add(client.SendAsync(requestMessage));
            }

            // ensure that every response was successful
            responses.ForEach(response =>
            {
                _logger.LogError("Received response");
                response.Result.EnsureSuccessStatusCode();
            });

            TestsFixture.TryStopServer();
        }

        /// <summary>
        /// Uploads a single mockdefinition to the server, and hits an endpoint multiple times
        /// </summary>
        [Fact]
        public void HitEndpointMultipleTimesTest()
        {
            TestsFixture.StartServer();

            // upload mockdefinition
            client.SendAsync(new HttpRequestMessage(HttpMethod.Post, TestsFixture.ORBITAL_URL)
            {
                Content = new StringContent(File.ReadAllText("./PetStoreBaseMockDefinition.json"), Encoding.UTF8, "application/json")
            }).Wait();

            // hit endpoint
            var responses = new List<Task<HttpResponseMessage>>();

            for (var i = 0; i < 10; i++)
            {
                HttpRequestMessage requestMessage = new HttpRequestMessage(HttpMethod.Get, $"{TestsFixture.LOCALHOST_URL}/pets");
                responses.Add(client.SendAsync(requestMessage));
            }

            // ensure that every response was successful
            responses.ForEach(response =>
            {
                _logger.LogError("Received response");
                response.Result.EnsureSuccessStatusCode();
            });

            TestsFixture.TryStopServer();
        }

        /// <summary>
        /// Sends the different mockdefinitions multiple times to test the memory capacity
        /// of the server
        /// </summary>
        [Fact]
        public void MemoryMockdefinitionTest()
        {
            TestsFixture.StartServer();
            var requests = new List<HttpRequestMessage>();
            var jsonMockdefinition = JObject.Parse(File.ReadAllText("./PetStoreBaseMockDefinition.json"));
            for (var i = 0; i < 10000; i++)
            {
                jsonMockdefinition["metadata"]["title"] = i.ToString();
                HttpRequestMessage requestMessage = new HttpRequestMessage(HttpMethod.Post, TestsFixture.ORBITAL_URL)
                {
                    Content = new StringContent(jsonMockdefinition.ToString(), Encoding.UTF8, "application/json")
                };

                requests.Add(requestMessage);
            }

            // send them all at once because JSON parsing and writing is slow in the main loop
            var responses = requests.Select(request => client.SendAsync(request)).ToList();

            // ensure that every response was successful
            responses.ForEach(response =>
            {
                _logger.LogError("Received response");
                response.Result.EnsureSuccessStatusCode();
            });

            TestsFixture.TryStopServer();
        }
    }
}
