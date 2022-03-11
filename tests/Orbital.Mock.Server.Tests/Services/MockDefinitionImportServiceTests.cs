using Orbital.Mock.Server.Services;
using Xunit;
using Bogus;
using Orbital.Mock.Definition;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;
using NSubstitute;
using Newtonsoft.Json;
using System.IO;

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

        static (MockDefinitionImportService mockDefImportService, MemoryCache cache) GetSetupObjects(string PATH = null) {
            var config_mock = Substitute.For<IOptions<MockDefinitionImportServiceConfig>>();
            config_mock.Value.Returns(new MockDefinitionImportServiceConfig
            {
                PATH = PATH,
            });

            var options = new MemoryCacheOptions();
            var cache = new MemoryCache(options);
            var mockDefImportService = new MockDefinitionImportService(cache, config_mock);

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

            mockDefImportService.ImportFromPath("./TestMockDefDirectory/mock_definition.json"); 

            cache.TryGetValue(testMockDefFileTitle, out var savedDefinition);

            Assert.NotNull(savedDefinition);
        }

        [Fact]
        public void ImportFromDirectoryPathSuccessTest()
        {
            #region Test Setup
            var (mockDefImportService, cache) = GetSetupObjects();
            #endregion

            mockDefImportService.ImportFromPath("./TestMockDefDirectory/");

            cache.TryGetValue(testMockDefFileTitle, out var savedDefinition);

            Assert.NotNull(savedDefinition);
        }

        [Fact]
        public void ImportFromInvalidFileFailTest()
        {
            #region Test Setup
            var (mockDefImportService, cache) = GetSetupObjects();
            #endregion

            Assert.Throws<JsonReaderException>(() => mockDefImportService.ImportFromPath("./mock_definition_invalid.json"));
        }
        
        [Fact]
        public void ImportFromEmptyJsonFileFailTest()
        {
            #region Test Setup
            var (mockDefImportService, cache) = GetSetupObjects();
            #endregion

            Assert.Throws<JsonSerializationException>(() => mockDefImportService.ImportFromPath("./mock_definition_empty.json"));
        }

        [Fact]
        public void FileNotExistsFailTest()
        {
            #region Test Setup
            var (mockDefImportService, cache) = GetSetupObjects();
            #endregion

            Assert.Throws<FileNotFoundException>(() => mockDefImportService.ImportFromPath("./mock_definition_not_exists.json"));
        }

        [Fact]
        public void ImportFromAllSuccessTest()
        {
            #region Test Setup
            var (mockDefImportService, cache) = GetSetupObjects("./TestMockDefDirectory/mock_definition.json");
            #endregion

            mockDefImportService.ImportAllIntoMemoryCache();

            cache.TryGetValue(testMockDefFileTitle, out var savedDefinition);

            Assert.NotNull(savedDefinition);
        }

        [Fact]
        public void ImportNothingSuccessTest()
        {
            #region Test Setup
            var (mockDefImportService, cache) = GetSetupObjects();
            #endregion

            mockDefImportService.ImportAllIntoMemoryCache();

            var actual = cache.Count;
            var expected = 0;

            Assert.Equal(expected, actual);
        }

    }
}
