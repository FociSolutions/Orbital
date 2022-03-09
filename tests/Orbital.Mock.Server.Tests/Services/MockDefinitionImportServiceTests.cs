using Orbital.Mock.Server.Services;
using Xunit;
using Bogus;
using Orbital.Mock.Definition;
using Microsoft.Extensions.Caching.Memory;

namespace Orbital.Mock.Server.Tests.Services
{
    public class MockDefinitionImportServiceTests
    {
        private readonly Faker<MockDefinition> fakeMockDefGenerator;
        private const string testMockDefFileTitle = "Pet Store Tests";

        public MockDefinitionImportServiceTests()
        {
            var metadataFake = new Faker<MetadataInfo>()
                .RuleFor(m => m.Title, f => f.Lorem.Sentence())
                .RuleFor(m => m.Description, f => f.Lorem.Paragraph());

            fakeMockDefGenerator = new Faker<MockDefinition>()
                .RuleFor(m => m.Host, f => f.Internet.DomainName())
                .RuleFor(m => m.Metadata, f => metadataFake.Generate());
        }

        static (MockDefinitionImportService mockDefImportService, MemoryCache cache) GetSetupObjects() {
            var options = new MemoryCacheOptions();
            var cache = new MemoryCache(options);
            var mockDefImportService = new MockDefinitionImportService(cache);

            return (mockDefImportService, cache);
        }

        [Fact]
        public void AddToMemoryCacheSuccessTest()
        {
            #region Test Setup
            var (mockDefImportService, cache) = GetSetupObjects();
            var mockDefinition = fakeMockDefGenerator.Generate();
            #endregion

            mockDefImportService.AddMockDefToMemoryCache(mockDefinition);

            cache.TryGetValue(mockDefinition.Metadata.Title, out var savedDefinition);

            Assert.NotNull(savedDefinition);
        }

        [Fact]
        public void ImportFromFileSuccessTest()
        {
            #region Test Setup
            var (mockDefImportService, cache) = GetSetupObjects();
            #endregion

            mockDefImportService.ImportFromFile("./mock_definition.json");

            cache.TryGetValue(testMockDefFileTitle, out var savedDefinition);

            Assert.NotNull(savedDefinition);
        }

        [Fact]
        public void ImportFromAllSuccessTest()
        {
            #region Test Setup
            var (mockDefImportService, cache) = GetSetupObjects();
            #endregion

            mockDefImportService.ImportAllIntoMemoryCache();

            cache.TryGetValue(testMockDefFileTitle, out var savedDefinition);

            Assert.NotNull(savedDefinition);
        }

    }
}
