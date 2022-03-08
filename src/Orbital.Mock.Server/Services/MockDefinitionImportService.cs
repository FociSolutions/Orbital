using System;
using System.Collections.Generic;

using Microsoft.Extensions.Caching.Memory;

using Orbital.Mock.Server.Services.Interfaces;
using Orbital.Mock.Definition;

using Serilog;

namespace Orbital.Mock.Server.Services
{
    public class MockDefinitionImportService : IMockDefinitionImportService
    {
        readonly IMemoryCache cache;
        const string MockDefFile = "./pet_store_tests.json";

        public MockDefinitionImportService(IMemoryCache cache)
        {
            this.cache = cache;
        }

        public void ImportAllIntoMemoryCache()
        {
            ImportFromDisk();
        }

        void ImportFromDisk()
        {
            var mockDefinition = MockDefinition.CreateFromFile(MockDefFile);

            Log.Information("MockDefinitionImportService: Imported Mock Definition from Disk, {mockDefinition}", mockDefinition.Metadata.Title);

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
