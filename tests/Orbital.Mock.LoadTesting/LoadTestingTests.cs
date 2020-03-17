using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Net.NetworkInformation;
using System.Net.Sockets;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace Orbital.Mock.LoadTesting
{
    public sealed class TestsFixture : IDisposable
    {
        public static readonly int ORBITAL_PORT = 5001;
        public static readonly string LOCALHOST_URL = $"https://localhost:{ORBITAL_PORT}";
        public static readonly string ENDPOINT_PATH = "/api/v1/OrbitalAdmin";
        public static readonly string ORBITAL_URL = $"{LOCALHOST_URL}{ENDPOINT_PATH}";
        public static Process OrbitalServerProcess;
        public TestsFixture()
        {
            // Do "global" initialization here; Only called once.
        }

        /// <summary>
        /// Attempts to quit the server when an exception occurred and the server
        /// was not terminated normally.
        /// </summary>
        public void Dispose()
        {
            if (OrbitalServerProcess != null)
            {
                TryStopProcess(OrbitalServerProcess);
            }
        }

        /// <summary>
        /// Forceably stops a process
        /// </summary>
        /// <param name="p">The process to stop</param>
        private static void TryStopProcess(Process p)
        {
            try
            {
                p.Kill();
                p.Close();
                p.Dispose();
            }
            catch (InvalidOperationException)
            {
                // do nothing because the process has already quit or does not exist
            }
        }

        public static void TryStopServer()
        {
            TryStopProcess(OrbitalServerProcess);
        }

        /// <summary>
        /// Starts the server. Only one instance of the server can run at one time.
        /// </summary>
        /// <returns>Returns the process instance of this server.</returns>
        public static void StartServer()
        {
            IsServerPortAvailable();
            string workingDirectory = Environment.CurrentDirectory;
            var projectDirectory = Directory.GetParent(workingDirectory).Parent.Parent.Parent.Parent;

            string finalpath = $"{projectDirectory}\\src\\Orbital.Mock.Server\\bin\\{ReleaseType}\\netcoreapp2.2\\win-x64\\Orbital.Mock.Server.exe";
            var p = new Process();

            p.StartInfo.FileName = finalpath;

            p.Start();
            OrbitalServerProcess = p;
        }

        /// <summary>
        /// Gets the current release type (e.g. Release/Debug) of the current configuration
        /// </summary>
        private static string ReleaseType
        {
            get
            {
#if DEBUG
                return "Debug";
#else
            return "Release";
#endif
            }
        }

        /// <summary>
        /// Checks if a port is available by simulating results from netstat -aon | findstr 5001
        /// It will not run taskkill /PID pid on the tasks; it will just throw an exception.
        /// This is required because if the tests crash, it will not quit the process and the server will
        /// still be running. Other processes may start, but the old version of the server will take priority
        /// if it is still running or a local server could be running by accident.
        /// </summary>
        private static void IsServerPortAvailable()
        {
            var ipGlobalProperties = IPGlobalProperties.GetIPGlobalProperties();
            var tcpConnInfoArray = ipGlobalProperties.GetActiveTcpConnections();
            var tcpListenerInfoArray = ipGlobalProperties.GetActiveTcpListeners();

            foreach (TcpConnectionInformation tcpi in tcpConnInfoArray)
            {
                if (tcpi.LocalEndPoint.Port == ORBITAL_PORT)
                {
                    // address in use error code WSAEADDRINUSE
                    throw new SocketException(10048);
                }
            }

            foreach (var tlpi in tcpListenerInfoArray)
            {
                if (tlpi.Port == ORBITAL_PORT)
                {
                    // address in use error code WSAEADDRINUSE
                    throw new SocketException(10048);
                }
            }
        }
    }

    public class LoadTestingTests : IClassFixture<TestsFixture>
    {
        /// <summary>
        /// Only one server should be allowed to run at once
        /// </summary>

        private static readonly HttpClient client = new HttpClient();

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
            responses.ForEach(response => response.Result.EnsureSuccessStatusCode());

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
            responses.ForEach(response => response.Result.EnsureSuccessStatusCode());

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
            responses.ForEach(response => response.Result.EnsureSuccessStatusCode());

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
            responses.ForEach(response => response.Result.EnsureSuccessStatusCode());

            TestsFixture.TryStopServer();
        }
    }
}
