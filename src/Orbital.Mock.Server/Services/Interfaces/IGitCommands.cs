using System;
using LibGit2Sharp;

namespace Orbital.Mock.Server.Services.Interfaces
{
    public interface IGitCommands
    {
        /// <summary>
        /// Creates a default CloneOptions object
        /// </summary>
        /// <returns>A CloneOptions object with default values</returns>
        CloneOptions GetCloneOptions();

        /// <summary>
        /// Clones a remote repo to the local filesystem
        /// </summary>
        /// <param name="sourceUrl">The URL of the repo</param>
        /// <param name="workdirPath">The local path to clone into</param>
        /// <param name="options">Options controlling clone behavior</param>
        /// <returns></returns>
        public string Clone(string sourceUrl, string workdirPath, CloneOptions options = null);
    }
}
