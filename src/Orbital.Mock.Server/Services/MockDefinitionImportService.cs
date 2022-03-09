using System;
using System.Collections.Generic;

using Microsoft.Extensions.Caching.Memory;

using Orbital.Mock.Server.Services.Interfaces;
using Orbital.Mock.Definition;

using Serilog;
using Microsoft.Extensions.Options;

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
        readonly IMemoryCache cache;
        string MockDefFile;

        public MockDefinitionImportService(IMemoryCache cache, IOptions<MockDefinitionImportServiceConfig> options)
        {
            this.cache = cache;
            MockDefFile = options.Value.PATH;
        }

        /// <summary>
        /// Imports MockDefinitions from all supported sources and loads them into the MemoryCache.
        /// </summary>
        public void ImportAllIntoMemoryCache()
        {
            if (MockDefFile != null)
            {
                Log.Information("MockDefinitionImportService: Attempting to load MockDef from provided file: '{File}'", MockDefFile);
                ImportFromFile(MockDefFile);
            }
        }

        /// <summary>
        /// Loads a MockDefinition from a file into the MemoryCache
        /// </summary>
        public void ImportFromFile(string fileName)
        {
            if (System.IO.File.Exists(fileName))
            {
                var mockDefinition = MockDefinition.CreateFromFile(fileName);

                Log.Information("MockDefinitionImportService: Imported Mock Definition from a File, {Title}", mockDefinition.Metadata.Title);

                AddMockDefToMemoryCache(mockDefinition);
            }
            else
            {
                Log.Warning("MockDefinitionImportService: Unable to import Mock Definition, file does not exist: {FileName}", fileName);
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
