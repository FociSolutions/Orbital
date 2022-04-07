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
using Orbital.Mock.Server.Services.Interfaces;

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

        (MockDefinitionImportService mockDefImportService, ILogger logger)
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
            var fss = Substitute.ForPartsOf<FileSystemService>();

            git.Configure().Clone(default, default).ReturnsForAnyArgs(x =>
            {
                var src = Path.Combine(fixtureDir, "mock_definition_valid.json");
                var dest = Path.Combine(MockDefinitionImportService.RepoDirectory, "mock_definition_valid.json");
                File.Copy(src, dest);
                var src2 = Path.Combine(fixtureDir, "directory_import_test", "mock_definition_1.json");
                var dest2 = Path.Combine(MockDefinitionImportService.RepoDirectory, "mock_definition_1.json");
                File.Copy(src2, dest2);
                return MockDefinitionImportService.RepoDirectory;
            });

            var mockDefImportService = new MockDefinitionImportService(cache, config_mock, git, fss, logger);

            return (mockDefImportService, logger);
        }

        [Fact]
        public void AddToMemoryCacheSuccessTest()
        {
            #region Test Setup
            var (mockDefImportService, _) = GetSetupObjects();
            var mockDefinition = fakeMockDefGenerator.Generate();
            #endregion

            var cache = mockDefImportService.AddMockDefToMemoryCache(mockDefinition);

            cache.TryGetValue(mockDefinition.Metadata.Title, out var savedDefinition);

            Assert.NotNull(savedDefinition);
        }

        [Fact]
        public void ImportFromFileSuccessTest()
        {
            #region Test Setup
            var path = Path.Combine(fixtureDir, "mock_definition_valid.json");
            var (mockDefImportService, _) = GetSetupObjects(PATH: path);
            #endregion

            var cache = mockDefImportService.ImportAllIntoMemoryCache();

            cache.TryGetValue(testMockDefFileTitle, out var savedDefinition);

            Assert.NotNull(savedDefinition);
        }

        [Fact]
        public void ImportFromNonExistantPathFailTest()
        {
            #region Test Setup
            var path = Path.Combine(fixtureDir, "not_a_directory", "mock_definition.json");
            var (mockDefImportService, _) = GetSetupObjects(PATH: path);
            #endregion

            var cache = mockDefImportService.ImportAllIntoMemoryCache();

            var actual = GetAddedMockDefinitionsIds(cache);

            Assert.Empty(actual);
        }

        [Fact]
        public void ImportFromDirectoryPathSuccessTest()
        {
            #region Test Setup
            var path = Path.Combine(fixtureDir, "directory_import_test");
            var (mockDefImportService, _) = GetSetupObjects(PATH: path);
            #endregion

            var cache = mockDefImportService.ImportAllIntoMemoryCache();

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
            var (mockDefImportService, _) = GetSetupObjects(PATH: string.Join(",", path1, path2));
            #endregion

            var cache = mockDefImportService.ImportAllIntoMemoryCache();

            var ids = GetAddedMockDefinitionsIds(cache);

            Assert.Equal(2, ids.Count());
        }

        [Fact]
        public void ImportFromMultiplePathsSomeInvalidSuccessTest()
        {
            #region Test Setup
            var path1 = Path.Combine(fixtureDir, "directory_import_test", "mock_definition_1.json");
            var path2 = Path.Combine(fixtureDir, "mock_def.json");
            var (mockDefImportService, _) = GetSetupObjects(PATH: string.Join(",", path1, path2));
            #endregion

            var cache = mockDefImportService.ImportAllIntoMemoryCache();

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
            var (mockDefImportService, _) = GetSetupObjects(PATH: string.Join(",", path1, path2, path3));
            #endregion

            var cache = mockDefImportService.ImportAllIntoMemoryCache();

            var actual = GetAddedMockDefinitionsIds(cache);

            Assert.Empty(actual);
        }

        [Fact]
        public void ImportFromInvalidFileFailTest()
        {
            #region Test Setup
            var path = Path.Combine(fixtureDir, "mock_definition_invalid.json");
            var (mockDefImportService, _) = GetSetupObjects(PATH: path);
            #endregion

            var cache = mockDefImportService.ImportAllIntoMemoryCache();

            var actual = GetAddedMockDefinitionsIds(cache);

            Assert.Empty(actual);
        }
        
        [Fact]
        public void ImportFromEmptyJsonFileFailTest()
        {
            #region Test Setup
            var path = Path.Combine(fixtureDir, "mock_definition_empty.json");
            var (mockDefImportService, _) = GetSetupObjects(PATH: path);
            #endregion

            var cache = mockDefImportService.ImportAllIntoMemoryCache();

            var actual = GetAddedMockDefinitionsIds(cache);

            Assert.Empty(actual);
        }

        [Fact]
        public void FileNotExistsFailTest()
        {
            #region Test Setup
            var path = Path.Combine(fixtureDir, "mock_definition_not_exists.json");
            var (mockDefImportService, _) = GetSetupObjects(PATH: path);
            #endregion

            var cache = mockDefImportService.ImportAllIntoMemoryCache();

            var actual = GetAddedMockDefinitionsIds(cache);

            Assert.Empty(actual);
        }

        [Fact]
        public void ImportFromAllSuccessTest()
        {
            #region Test Setup
            var path = Path.Combine(fixtureDir, "mock_definition_valid.json");
            var (mockDefImportService, _) = GetSetupObjects(path);
            #endregion

            var cache = mockDefImportService.ImportAllIntoMemoryCache();

            cache.TryGetValue(testMockDefFileTitle, out var savedDefinition);

            Assert.NotNull(savedDefinition);
        }

        [Fact]
        public void ImportNothingSuccessTest()
        {
            #region Test Setup
            var (mockDefImportService, _) = GetSetupObjects();
            #endregion

            var cache = mockDefImportService.ImportAllIntoMemoryCache();

            var actual = GetAddedMockDefinitionsIds(cache);

            Assert.Empty(actual);
        }

        [Fact]
        public void LogOutputMessageTest()
        {
            #region Test Setup
            var path = Path.Combine(fixtureDir, "mock_definition_empty.json");
            var (mockDefImportService, logger) = GetSetupObjects(PATH: path);
            #endregion

            var cache = mockDefImportService.ImportAllIntoMemoryCache();

            logger.ReceivedWithAnyArgs().Error("{Test}", "");

            var errorCalls = logger.ReceivedCalls().Where(x => x.GetMethodInfo().Name == nameof(logger.Error));
            var actual = GetAddedMockDefinitionsIds(cache);

            Assert.Single(errorCalls);
            Assert.Empty(actual);
        }

        [Fact]
        public void EmptyLogOutputAsImportWasSuccessfulTest()
        {
            #region Test Setup
            var path = Path.Combine(fixtureDir, "mock_definition_valid.json");
            var (mockDefImportService, logger) = GetSetupObjects(PATH: path);
            #endregion

            var cache = mockDefImportService.ImportAllIntoMemoryCache();

            var errorCalls = logger.ReceivedCalls().Where(x => x.GetMethodInfo().Name == nameof(logger.Error));
            cache.TryGetValue(testMockDefFileTitle, out var savedDefinition);
            var actual = GetAddedMockDefinitionsIds(cache);

            Assert.Empty(errorCalls);
            Assert.NotNull(savedDefinition);
            Assert.Single(actual);
        }

        [Fact]
        public void ImportFromGitRepoSuccessTest()
        {
            #region Test Setup
            var path = Path.Combine(".", "mock_definition_valid.json");
            var (mockDefImportService, _) = GetSetupObjects(GIT_REPO: "https://github.com/not-a-git-repo", GIT_BRANCH: "test_branch", GIT_PATH: path);
            #endregion

            var cache = mockDefImportService.ImportAllIntoMemoryCache();

            cache.TryGetValue(testMockDefFileTitle, out var savedDefinition);
            var ids = GetAddedMockDefinitionsIds(cache);

            Assert.False(Directory.Exists(MockDefinitionImportService.RepoDirectory));
            Assert.NotNull(savedDefinition);
            Assert.Single(ids);
        }

        [Fact]
        public void ImportFromGitRepoMultiPathsSuccessTest()
        {
            #region Test Setup
            var path1 = Path.Combine(".", "mock_definition_valid.json");
            var path2 = Path.Combine(".", "mock_definition_1.json");
            var path = string.Join(",", path1, path2);
            var (mockDefImportService, _) = GetSetupObjects(GIT_REPO: "https://github.com/not-a-git-repo", GIT_BRANCH: "test_branch", GIT_PATH: path);
            #endregion

            var cache = mockDefImportService.ImportAllIntoMemoryCache();

            cache.TryGetValue(testMockDefFileTitle, out var savedDefinition);
            cache.TryGetValue($"{testMockDefFileTitle} 1", out var savedDefinition1);
            var ids = GetAddedMockDefinitionsIds(cache);

            Assert.False(Directory.Exists(MockDefinitionImportService.RepoDirectory));
            Assert.NotNull(savedDefinition);
            Assert.NotNull(savedDefinition1);
            Assert.Equal(2, ids.Count());
        }

        static IEnumerable<string> GetAddedMockDefinitionsIds(IMemoryCache cache)
        {
            return cache.GetOrCreate(Constants.MOCK_IDS_CACHE_KEY, c => new List<string>());
        }
    }
}
