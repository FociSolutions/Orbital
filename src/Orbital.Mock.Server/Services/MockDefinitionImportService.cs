using System.IO;
using System.Collections.Generic;

using Microsoft.Extensions.Options;
using Microsoft.Extensions.Caching.Memory;

using Orbital.Mock.Server.Services.Interfaces;
using Orbital.Mock.Definition;

using Serilog;
using Newtonsoft.Json;
using LibGit2Sharp;

namespace Orbital.Mock.Server.Services
{

    public class MockDefinitionImportServiceConfig
    {
        /// <summary>
        /// The file path for the MockDefinition json file to be imported and loaded at startup
        /// </summary>
        public string PATH { get; set; }

        /// <summary>
        /// The url to a git repo to clone and import mock definiitons from
        /// </summary>
        public string GIT_REPO { get; set; }

        /// <summary>
        /// The branch to use when cloning a git repo for the purposes of importing mock definitions from it
        /// </summary>
        public string GIT_BRANCH { get; set; }

        /// <summary>
        /// The path to import from when cloning a git repo for the purposes of importing mock definitions from it.
        /// It must be a file or directory that is relative to the root of the git repo.
        /// </summary>
        public string GIT_PATH { get; set; }
    }

    /// <summary>
    /// A utility class used to manage the importing and loading of MockDefinitions from various sources
    /// </summary>
    public class MockDefinitionImportService : IMockDefinitionImportService
    {

        const string MockDefExtension = ".json";
        readonly string RepoDirectory = Path.Combine(".", ".orbital_temp_git_repo");

        readonly IMemoryCache cache;
        readonly MockDefinitionImportServiceConfig config;
        readonly ILogger Log;

        public MockDefinitionImportService(IMemoryCache cache, IOptions<MockDefinitionImportServiceConfig> options, ILogger injectedLog = null)
        {
            this.cache = cache;
            config = options.Value;
            Log = injectedLog ?? Serilog.Log.Logger;
        }

        /// <summary>
        /// Imports MockDefinitions from all supported sources and loads them into the MemoryCache.
        /// </summary>
        public void ImportAllIntoMemoryCache()
        {
            if (config.PATH != null)
            {
                Log.Information("MockDefinitionImportService: Attempting to load MockDef(s) from PATH option: '{MockDefPath}'", config.PATH);
                ImportFromPath(config.PATH);
            }

            if (config.GIT_REPO != null)
            {
                Log.Information("MockDefinitionImportService: Attempting to load MockDef(s) from GIT_REPO option: '{Repo}'", config.GIT_REPO);
                ImportFromGitRepo(config.GIT_REPO, config.GIT_BRANCH, config.GIT_PATH);
            }
        }

        /// <summary>
        /// Loads a MockDefinition from one or many filepaths into the MemoryCache
        /// </summary>
        /// <param name="filePath">Input filepath (string) to be parsed
        /// - can be directory or file
        /// - can be singular filepath
        /// - can represent multiple filepaths, separated by comma
        /// </param>
        internal void ImportFromPath(string filePath)
        {
            var paths = filePath.Contains(',') ? filePath.Split(',') : new string[] { filePath };

            foreach (var path in paths)
            {
                if (File.Exists(path))
                {
                    ImportFromFile(path);
                }
                else if (Directory.Exists(path))
                {
                    var mockDefs = Directory.GetFiles(path, $"*{MockDefExtension}");

                    if (mockDefs.Length == 0) Log.Warning($"MockDefinitionImportService: Attempted to load mock definitions from empty directory: '{filePath}'");

                    foreach (string mockDefPath in mockDefs) { ImportFromFile(mockDefPath); }
                }
                else
                {
                    Log.Error($"{path} is not a valid file or directory.");
                }
            }
        }

        /// <summary>
        /// Loads MockDefinition from file into MemoryCache
        /// </summary>
        /// <param name="fileName"></param>
        void ImportFromFile(string fileName)
        {
            if (!File.Exists(fileName))
            {
                Log.Error($"MockDefinitionImportService: Failed to find Mock Definition file: {fileName}");
                return;
            }
            
            var mockDefinition = MockDefinition.CreateFromFile(fileName);
            
            if (mockDefinition != null)
            {
                Log.Information($"MockDefinitionImportService: Imported Mock Definition from a File, {mockDefinition.Metadata.Title}");

                AddMockDefToMemoryCache(mockDefinition);
            }
            else
            {
                Log.Error($"MockDefinitionImportService: Failed to import Mock Definition from a File: '{fileName}'");
            }
        }

        /// <summary>
        /// Load MockDefinitions from the specified git repo into the MemoryCache.
        /// </summary>
        /// <param name="repo"></param>
        /// <param name="branch">The branch to checkout. If not specified, the default branch is used.</param>
        /// <param name="path">The path of the mock definition to import, relative to the root of the repo.
        ///                    If not specified, mockdefinitions will be loaded from the root of the repo. </param>
        private void ImportFromGitRepo(string repo, string branch = null, string path = ".")
        {
            if (Directory.Exists(RepoDirectory)) { Directory.Delete(RepoDirectory, true); }

            _ = Directory.CreateDirectory(RepoDirectory);

            var options = new CloneOptions();
            if (branch != null) { options.BranchName = branch; }

            _ = Repository.Clone(repo, RepoDirectory, options);

            ImportFromPath(Path.Combine(RepoDirectory, path));

            if (Directory.Exists(RepoDirectory)) { Directory.Delete(RepoDirectory, true); }
        }

        /// <summary>
        /// Loads the given MockDefinition into the memory cache
        /// </summary>
        /// <param name="mockDefinition"></param>
        public void AddMockDefToMemoryCache(MockDefinition mockDefinition)
        {
            _ = cache.Set(mockDefinition.Metadata.Title, mockDefinition);
            var keysCollection = cache.GetOrCreate(Constants.MOCK_IDS_CACHE_KEY, cacheEntry => { return new List<string>(); });

            if (!keysCollection.Contains(mockDefinition.Metadata.Title))
            {
                keysCollection.Add(mockDefinition.Metadata.Title);
                _ = cache.Set(Constants.MOCK_IDS_CACHE_KEY, keysCollection);
            }
        }

        /// <summary>
        /// Checks if the passed path is a file or a directory
        /// </summary>
        /// <param name="filePath"></param>
        /// <returns>True if directory, false if file</returns>
        static bool IsDirectory(string filePath)
        {
            return Directory.Exists(filePath);
        }

    }
}
