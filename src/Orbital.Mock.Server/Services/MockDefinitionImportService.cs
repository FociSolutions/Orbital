using System.IO;
using System.Collections.Generic;

using Microsoft.Extensions.Options;
using Microsoft.Extensions.Caching.Memory;

using Orbital.Mock.Server.Services.Interfaces;
using Orbital.Mock.Definition;

using Serilog;
using Newtonsoft.Json;

namespace Orbital.Mock.Server.Services
{

    public class MockDefinitionImportServiceConfig
    {
        /// <summary>
        /// The file path for the MockDefinition json file to be imported and loaded at startup
        /// </summary>
        public string PATH { get; set; }
    }

    /// <summary>
    /// A utility class used to manage the importing and loading of MockDefinitions from various sources
    /// </summary>
    public class MockDefinitionImportService : IMockDefinitionImportService
    {
        const string MockDefExtension = ".json";

        readonly IMemoryCache cache;
        string MockDefPath;

        public MockDefinitionImportService(IMemoryCache cache, IOptions<MockDefinitionImportServiceConfig> options)
        {
            this.cache = cache;
            MockDefPath = options.Value.PATH;
        }

        /// <summary>
        /// Imports MockDefinitions from all supported sources and loads them into the MemoryCache.
        /// </summary>
        public void ImportAllIntoMemoryCache()
        {
            if (MockDefPath != null)
            {
                Log.Information($"MockDefinitionImportService: Attempting to load MockDef(s) from PATH option: '{MockDefPath}'");
                ImportFromPath(MockDefPath);
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
                Log.Warning($"Failed to find Mock Definition file: {fileName}");
                return;
            }
            
            try
            {                      
                var mockDefinition = MockDefinition.CreateFromFile(fileName);

                Log.Information($"MockDefinitionImportService: Imported Mock Definition from a File, {mockDefinition.Metadata.Title}");

                AddMockDefToMemoryCache(mockDefinition);
            }
            catch (JsonSerializationException e)
            {
                Log.Error($"Failed to parse Mock Definition from file '{fileName}' with Exception: {e}");
                throw e;
            }
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
