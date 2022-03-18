using Orbital.Mock.Server.Services;
using Xunit;
using Bogus;
using Orbital.Mock.Definition;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;
using NSubstitute;
using NSubstitute.Extensions;
using System.IO;
using System.Linq;
using System.Collections.Generic;
using Serilog;

namespace Orbital.Mock.Server.Tests.Services
{
    public class MockDefinitionImportServiceTests
    {
        private readonly Faker<MockDefinition> fakeMockDefGenerator;
        private const string testMockDefFileTitle = "Pet Store Tests";
        private readonly string fixtureDir = Path.Combine(".", "fixtures");

        public MockDefinitionImportServiceTests()
        {
            var metadataFake = new Faker<MetadataInfo>()
                .RuleFor(m => m.Title, f => f.Lorem.Sentence())
                .RuleFor(m => m.Description, f => f.Lorem.Paragraph());

            fakeMockDefGenerator = new Faker<MockDefinition>()
                .RuleFor(m => m.Host, f => f.Internet.DomainName())
                .RuleFor(m => m.Metadata, f => metadataFake.Generate());
        }

        (MockDefinitionImportService mockDefImportService, MemoryCache cache, ILogger logger)
        GetSetupObjects(string PATH = null, string GIT_REPO = null, string GIT_BRANCH = null, string GIT_PATH = null)
        {
            var config_mock = Substitute.For<IOptions<MockDefinitionImportServiceConfig>>();
            config_mock.Value.Returns(new MockDefinitionImportServiceConfig
            {
                PATH = PATH,
                GIT_REPO = GIT_REPO,
                GIT_BRANCH = GIT_BRANCH,
                GIT_PATH = GIT_PATH,
            });

            var cache = new MemoryCache(new MemoryCacheOptions());
            var git = Substitute.ForPartsOf<GitCommands>();
            var logger = Substitute.For<ILogger>();

            git.Configure().Clone(default, default).ReturnsForAnyArgs(x =>
            {
                var src = Path.Combine(fixtureDir, "mock_definition_valid.json");
                var dest = Path.Combine(MockDefinitionImportService.RepoDirectory, "mock_definition_valid.json");
                File.Copy(src, dest);
                return MockDefinitionImportService.RepoDirectory;
            });

            var mockDefImportService = new MockDefinitionImportService(cache, config_mock, git, logger);

            return (mockDefImportService, cache, logger);
        }

        [Fact]
        public void AddToMemoryCacheSuccessTest()
        {
            #region Test Setup
            var (mockDefImportService, cache, _) = GetSetupObjects();
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
            var path = Path.Combine(fixtureDir, "mock_definition_valid.json");
            var (mockDefImportService, cache, _) = GetSetupObjects(PATH: path);
            #endregion

            mockDefImportService.ImportAllIntoMemoryCache();

            cache.TryGetValue(testMockDefFileTitle, out var savedDefinition);

            Assert.NotNull(savedDefinition);
        }

        [Fact]
        public void ImportFromNonExistantPathFailTest()
        {
            #region Test Setup
            var path = Path.Combine(fixtureDir, "not_a_directory", "mock_definition.json");
            var (mockDefImportService, cache, _) = GetSetupObjects(PATH: path);
            #endregion

            mockDefImportService.ImportAllIntoMemoryCache();

            var actual = cache.Count;

            Assert.Equal(0, actual);
        }

        [Fact]
        public void ImportFromDirectoryPathSuccessTest()
        {
            #region Test Setup
            var path = Path.Combine(fixtureDir, "directory_import_test");
            var (mockDefImportService, cache, _) = GetSetupObjects(PATH: path);
            #endregion

            mockDefImportService.ImportAllIntoMemoryCache();

            cache.TryGetValue($"{testMockDefFileTitle} 1", out var savedDefinition1);
            cache.TryGetValue($"{testMockDefFileTitle} 2", out var savedDefinition2);

            Assert.NotNull(savedDefinition1);
            Assert.NotNull(savedDefinition2);
        }

        [Fact]
        public void ImportFromMultiplePathsSuccessTest()
        {
            #region Test Setup
            var path1 = Path.Combine(fixtureDir, "directory_import_test", "mock_definition_1.json");
            var path2 = Path.Combine(fixtureDir, "mock_definition_valid.json");
            var (mockDefImportService, cache, _) = GetSetupObjects(PATH: $"{path1},{path2}");
            #endregion

            mockDefImportService.ImportAllIntoMemoryCache();

            var ids = GetAddedMockDefinitionsIds(cache);

            Assert.Equal(2, ids.Count());
        }

        [Fact]
        public void ImportFromMultiplePathsSomeInvalidSuccessTest()
        {
            #region Test Setup
            var path1 = Path.Combine(fixtureDir, "directory_import_test", "mock_definition_1.json");
            var path2 = Path.Combine(fixtureDir, "mock_def.json");
            var (mockDefImportService, cache, _) = GetSetupObjects(PATH: $"{path1},{path2}");
            #endregion

            mockDefImportService.ImportAllIntoMemoryCache();

            var ids = GetAddedMockDefinitionsIds(cache);

            Assert.Single(ids);
        }

        [Fact]
        public void ImportFromMultiplePathsAllInvalidSuccessTest()
        {
            #region Test Setup
            var path1 = Path.Combine(fixtureDir, "directory_import_test", "mock_definition_not_exists.json");
            var path2 = Path.Combine(fixtureDir, "mock_definition_not_exists.json");
            var path3 = Path.Combine(fixtureDir, "directory_not_exists");
            var (mockDefImportService, cache, _) = GetSetupObjects(PATH: $"{path1},{path2},{path3}");
            #endregion

            mockDefImportService.ImportAllIntoMemoryCache();

            var ids = GetAddedMockDefinitionsIds(cache);

            Assert.Empty(ids);
        }

        [Fact]
        public void ImportFromInvalidFileFailTest()
        {
            #region Test Setup
            var path = Path.Combine(fixtureDir, "mock_definition_invalid.json");
            var (mockDefImportService, cache, _) = GetSetupObjects(PATH: path);
            #endregion

            mockDefImportService.ImportAllIntoMemoryCache();

            var actual = cache.Count;
            var expected = 0;

            Assert.Equal(expected, actual);
        }
        
        [Fact]
        public void ImportFromEmptyJsonFileFailTest()
        {
            #region Test Setup
            var path = Path.Combine(fixtureDir, "mock_definition_empty.json");
            var (mockDefImportService, cache, _) = GetSetupObjects(PATH: path);
            #endregion

            mockDefImportService.ImportAllIntoMemoryCache();

            var actual = cache.Count;
            var expected = 0;

            Assert.Equal(expected, actual);
        }

        [Fact]
        public void FileNotExistsFailTest()
        {
            #region Test Setup
            var path = Path.Combine(fixtureDir, "mock_definition_not_exists.json");
            var (mockDefImportService, cache, _) = GetSetupObjects(PATH: path);
            #endregion

            mockDefImportService.ImportAllIntoMemoryCache();

            var actual = cache.Count;
            var expected = 0;

            Assert.Equal(expected, actual);
        }

        [Fact]
        public void ImportFromAllSuccessTest()
        {
            #region Test Setup
            var path = Path.Combine(fixtureDir, "mock_definition_valid.json");
            var (mockDefImportService, cache, _) = GetSetupObjects(path);
            #endregion

            mockDefImportService.ImportAllIntoMemoryCache();

            cache.TryGetValue(testMockDefFileTitle, out var savedDefinition);

            Assert.NotNull(savedDefinition);
        }

        [Fact]
        public void ImportNothingSuccessTest()
        {
            #region Test Setup
            var (mockDefImportService, cache, _) = GetSetupObjects();
            #endregion

            mockDefImportService.ImportAllIntoMemoryCache();

            var actual = cache.Count;
            var expected = 0;

            Assert.Equal(expected, actual);
        }

        [Fact]
        public void LogOutputMessageTest()
        {
            #region Test Setup
            var path = Path.Combine(fixtureDir, "mock_definition_empty.json");
            var (mockDefImportService, cache, logger) = GetSetupObjects(PATH: path);
            #endregion

            mockDefImportService.ImportAllIntoMemoryCache();

            logger.ReceivedWithAnyArgs().Error("{Test}", "");

            var errorCalls = logger.ReceivedCalls().Where(x => x.GetMethodInfo().Name == nameof(logger.Error));
            var actual = cache.Count;
            var expected = 0;

            Assert.Single(errorCalls);
            Assert.Equal(expected, actual);
        }

        [Fact]
        public void EmptyLogOutputAsImportWasSuccessfulTest()
        {
            #region Test Setup
            var path = Path.Combine(fixtureDir, "mock_definition_valid.json");
            var (mockDefImportService, cache, logger) = GetSetupObjects(PATH: path);
            #endregion

            mockDefImportService.ImportAllIntoMemoryCache();

            var errorCalls = logger.ReceivedCalls().Where(x => x.GetMethodInfo().Name == nameof(logger.Error));

            cache.TryGetValue(testMockDefFileTitle, out var savedDefinition);
            var ids = GetAddedMockDefinitionsIds(cache);

            Assert.Empty(errorCalls);
            Assert.NotNull(savedDefinition);
            Assert.Single(ids);
        }

        [Fact]
        public void ImportFromGitRepoSuccessTest()
        {
            #region Test Setup
            var (mockDefImportService, cache, _) = GetSetupObjects(GIT_REPO: "https://github.com/not-a-git-repo", GIT_BRANCH: "test_branch", GIT_PATH: ".");
            #endregion

            mockDefImportService.ImportAllIntoMemoryCache();

            cache.TryGetValue(testMockDefFileTitle, out var savedDefinition);
            var ids = GetAddedMockDefinitionsIds(cache);

            Assert.False(Directory.Exists(MockDefinitionImportService.RepoDirectory));
            Assert.NotNull(savedDefinition);
            Assert.Single(ids);
        }

        static IEnumerable<string> GetAddedMockDefinitionsIds(IMemoryCache cache)
        {
            return cache.GetOrCreate(Constants.MOCK_IDS_CACHE_KEY, c => new List<string>());
        }
    }
}
