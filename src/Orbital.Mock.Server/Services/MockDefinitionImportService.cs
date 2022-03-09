using System;
using System.Collections.Generic;

using Microsoft.Extensions.Caching.Memory;

using Orbital.Mock.Server.Services.Interfaces;
using Orbital.Mock.Definition;

using Serilog;

namespace Orbital.Mock.Server.Services
{
    /// <summary>
    /// A utility class used to manage the importing and loading of MockDefinitions from various sources
    /// </summary>
    public class MockDefinitionImportService : IMockDefinitionImportService
    {
        readonly IMemoryCache cache;
        const string MockDefFile = "./mock_definition.json";

        public MockDefinitionImportService(IMemoryCache cache)
        {
            this.cache = cache;
        }

        /// <summary>
        /// Imports MockDefinitions from all supported sources and loads them into the MemoryCache.
        /// </summary>
        public void ImportAllIntoMemoryCache()
        {
            ImportFromFile(MockDefFile);
        }

        /// <summary>
        /// Loads a MockDefinition from a file into the MemoryCache
        /// </summary>
        void ImportFromFile(string fileName)
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
        void AddMockDefToMemoryCache(MockDefinition mockDefinition)
        {
            cache.Set(mockDefinition.Metadata.Title, mockDefinition);
            var keysCollection = this.cache.GetOrCreate(Constants.MOCK_IDS_CACHE_KEY, cacheEntry => { return new List<string>(); });

            if (!keysCollection.Contains(mockDefinition.Metadata.Title))
            {
                keysCollection.Add(mockDefinition.Metadata.Title);
                this.cache.Set(Constants.MOCK_IDS_CACHE_KEY, keysCollection);
            }
        }

    }
}
