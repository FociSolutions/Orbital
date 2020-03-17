using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Net.NetworkInformation;
using System.Net.Sockets;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace Orbital.Mock.LoadTesting
{
    public class LoadTestingTests
    {
        /// <summary>
        /// Only one server should be allowed to run at once
        /// </summary>
        public static object serverRunning = new object();
        private static readonly HttpClient client = new HttpClient();
        public static readonly int ORBITAL_PORT = 5001;
        public static readonly string ENDPOINT_PATH = "/api/v1/OrbitalAdmin";
        public static readonly string ORBITAL_URL = $"https://localhost:{ORBITAL_PORT}{ENDPOINT_PATH}";

        [Fact]
        public async void SendParallelRequestsTest()
        {
            Process p = StartServer();
            IsPortAvailable();
            var responses = new List<Task<HttpResponseMessage>>();

            for (var i = 0; i < 100000; i++)
            {
                var response = client.GetAsync(ORBITAL_URL);
                responses.Add(response);
            }

            // ensure that every response was successful
            responses.ForEach(response => response.Result.EnsureSuccessStatusCode());

            // stop server
            TryStopProcess(p);
        }

        /// <summary>
        /// Sends the same mockdefinition multiple times to test the re-writing capability
        /// of the database
        /// </summary>
        [Fact]
        public async void SendSameMockdefinitionMultipleTimesTest()
        {
            Process p = StartServer();
            IsPortAvailable();
            var responses = new List<Task<HttpResponseMessage>>();

            for (var i = 0; i < 100; i++)
            {
                HttpRequestMessage requestMessage = new HttpRequestMessage(HttpMethod.Post, ORBITAL_URL)
                {
                    Content = new StringContent(File.ReadAllText("./PetStoreBaseMockDefinition.json"), Encoding.UTF8, "application/json")
                };

                responses.Add(client.SendAsync(requestMessage));
            }

            // ensure that every response was successful
            responses.ForEach(response => response.Result.EnsureSuccessStatusCode());

            // stop server
            TryStopProcess(p);
        }

        /// <summary>
        /// Sends the different mockdefinitions multiple times to test the memory capacity
        /// of the server
        /// </summary>
        [Fact]
        public async void MemoryMockdefinitionTest()
        {
            Process p = StartServer();
            IsPortAvailable();
            var responses = new List<Task<HttpResponseMessage>>();

            for (var i = 0; i < 100; i++)
            {
                HttpRequestMessage requestMessage = new HttpRequestMessage(HttpMethod.Post, ORBITAL_URL)
                {
                    Content = new StringContent(File.ReadAllText("./PetStoreBaseMockDefinition.json"), Encoding.UTF8, "application/json")
                };

                responses.Add(client.SendAsync(requestMessage));
            }

            // ensure that every response was successful
            responses.ForEach(response => response.Result.EnsureSuccessStatusCode());

            // stop server
            TryStopProcess(p);
        }

        /// <summary>
        /// Checks if a port is available by simulating results from netstat -aon | findstr 5001
        /// It will not run taskkill /PID pid on the tasks; it will just throw an exception.
        /// This is required because if the tests crash, it will not quit the process and the server will
        /// still be running. Other processes may start, but the old version of the server will take priority
        /// if it is still running or a local server could be running by accident.
        /// </summary>
        public static void IsPortAvailable()
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

        /// <summary>
        /// Forceably stops a process
        /// </summary>
        /// <param name="p">The process to stop</param>
        private static void TryStopProcess(Process p)
        {
            try
            {
                p.Kill();
            }
            catch (InvalidOperationException)
            {
                // do nothing because the process has already quit or does not exist
            }
        }

        /// <summary>
        /// Starts the server. Only one instance of the server can run at one time.
        /// </summary>
        /// <returns>Returns the process instance of this server.</returns>
        private static Process StartServer()
        {
            lock (serverRunning)
            {
                string workingDirectory = Environment.CurrentDirectory;
                var projectDirectory = Directory.GetParent(workingDirectory).Parent.Parent.Parent.Parent;

                string finalpath = $"{projectDirectory}\\src\\Orbital.Mock.Server\\bin\\{ReleaseType}\\netcoreapp2.2\\win-x64\\Orbital.Mock.Server.exe";
                var p = new Process();

                p.StartInfo.FileName = finalpath;
                
                p.Start();
                return p;
            }
        }

        /// <summary>
        /// Gets the current release type (e.g. Release/Debug) of the current configuration
        /// </summary>
        public static string ReleaseType
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
    }
}
