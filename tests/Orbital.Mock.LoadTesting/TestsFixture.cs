using System;
using System.Diagnostics;
using System.IO;
using System.Net.NetworkInformation;
using System.Net.Sockets;
using System.Threading.Tasks;

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
            finally
            {
                WaitForPortToBeAvailable();
            }
        }

        private static void WaitForPortToBeAvailable()
        {
            // wait maximum five seconds for TCP ports to be closed so that other tests
            // are not interrupted; if this is not used then other tests can fail sometimes
            // with the error "port is in use"
            for (int i = 0; i < 10; i++)
            {
                Task.Delay(500).Wait();
                try
                {
                    IsServerPortAvailable();
                    break;
                }
                catch (SocketException)
                {
                    // continue waiting
                }
            }
        }

        /// <summary>
        /// Stops the Orbital server instance
        /// </summary>
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
            WaitForPortToBeAvailable();
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
}
