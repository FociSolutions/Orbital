using System;
using System.Diagnostics;
using System.IO;
using System.Threading.Tasks;
using Xunit;

namespace Orbital.Mock.LoadTesting
{
    public class LoadTestingTests
    {
        /// <summary>
        /// Only one server should be allowed to run at once
        /// </summary>
        public static object serverRunning;

        [Fact]
        public async void SampleTestForFifteenSeconds()
        {
            Process p = StartServer();

            // wait 15 seconds to stop server
            await Task.Delay((int)TimeSpan.FromSeconds(15).TotalMilliseconds);

            // stop server
            StopProcess(p);
        }

        /// <summary>
        /// Forceably stops a process
        /// </summary>
        /// <param name="p">The process to stop</param>
        private static void StopProcess(Process p)
        {
            p.Kill();
        }

        /// <summary>
        /// Starts the server
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
