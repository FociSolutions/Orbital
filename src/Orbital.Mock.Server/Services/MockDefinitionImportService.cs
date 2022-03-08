using System;

using Microsoft.Extensions.Caching.Memory;

using Orbital.Mock.Server.Services.Interfaces;
using Orbital.Mock.Definition;

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
            //var baseDir = System.Reflection.Assembly.GetExecutingAssembly().Location;
            //var mockDefinition = MockDefinition.CreateFromFile(System.IO.Path.Combine(baseDir, MockDefFile));
            var mockDefinition = MockDefinition.CreateFromFile(MockDefFile);

            cache.Set(mockDefinition.Metadata.Title, mockDefinition);
        }

    }
}
