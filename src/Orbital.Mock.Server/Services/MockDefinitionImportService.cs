using System;
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
        /// Loads a MockDefinition from a given filepath into the MemoryCache
        /// </summary>
        /// <param name="filePath">Input filepath to be parsed - can be directory or file</param>
        public void ImportFromPath(string filePath)
        {
            if (Directory.Exists(filePath))
            {
                var mockDefs = Directory.GetFiles(filePath, $"*{MockDefExtension}");

                if (mockDefs.Length == 0) Log.Warning($"MockDefinitionImportService: Attempted to load mock definitions from empty directory: '{filePath}'");
                
                foreach (string path in mockDefs) { ImportFromFile(path); }
            } 
            else
            {
                ImportFromFile(filePath);
            }
        }

        /// <summary>
        /// Loads MockDefinition from file into MemoryCache
        /// </summary>
        /// <param name="fileName"></param>
        void ImportFromFile(string fileName)
        {
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

    }
}
