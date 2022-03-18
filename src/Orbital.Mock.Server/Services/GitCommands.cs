using Orbital.Mock.Server.Services.Interfaces;

using LibGit2Sharp;

namespace Orbital.Mock.Server.Services
{
    public class GitCommands : IGitCommands
    {
        /// <inheritdoc />
        public virtual CloneOptions GetCloneOptions()
        {
            return new CloneOptions();
        }

        /// <inheritdoc />
        public virtual string Clone(string sourceUrl, string workdirPath, CloneOptions options = null)
        {
            if (options != null) {
                return Repository.Clone(sourceUrl, workdirPath, options);
            }  else  {
                return Repository.Clone(sourceUrl, workdirPath);
            }
        }
    }
}
