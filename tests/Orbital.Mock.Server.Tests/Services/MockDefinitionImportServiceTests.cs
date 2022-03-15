﻿using Orbital.Mock.Server.Services;
using Xunit;
using Bogus;
using Orbital.Mock.Definition;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;
using NSubstitute;
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

        public MockDefinitionImportServiceTests()
        {
            var metadataFake = new Faker<MetadataInfo>()
                .RuleFor(m => m.Title, f => f.Lorem.Sentence())
                .RuleFor(m => m.Description, f => f.Lorem.Paragraph());

            fakeMockDefGenerator = new Faker<MockDefinition>()
                .RuleFor(m => m.Host, f => f.Internet.DomainName())
                .RuleFor(m => m.Metadata, f => metadataFake.Generate());
        }

        static (MockDefinitionImportService mockDefImportService, MemoryCache cache, ILogger logger) GetSetupObjects(string PATH = null) {
            var config_mock = Substitute.For<IOptions<MockDefinitionImportServiceConfig>>();
            config_mock.Value.Returns(new MockDefinitionImportServiceConfig
            {
                PATH = PATH,
            });

            var cache = new MemoryCache(new MemoryCacheOptions());
            var git = Substitute.For<IGitCommands>();
            var logger = Substitute.For<ILogger>();

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
            var (mockDefImportService, cache, _) = GetSetupObjects();
            #endregion

            var path = Path.Combine(".", "fixtures", "mock_definition_valid.json");
            mockDefImportService.ImportFromPath(path); 

            cache.TryGetValue(testMockDefFileTitle, out var savedDefinition);

            Assert.NotNull(savedDefinition);
        }

        [Fact]
        public void ImportFromNonExistantPathFailTest()
        {
            #region Test Setup
            var (mockDefImportService, cache, _) = GetSetupObjects();
            #endregion

            var path = Path.Combine(".", "fixtures", "not_a_directory", "mock_definition.json");
            mockDefImportService.ImportFromPath(path);

            var actual = cache.Count;

            Assert.Equal(0, actual);
        }

        [Fact]
        public void ImportFromDirectoryPathSuccessTest()
        {
            #region Test Setup
            var (mockDefImportService, cache, _) = GetSetupObjects();
            #endregion

            var path = Path.Combine(".", "fixtures", "directory_import_test");
            mockDefImportService.ImportFromPath(path);

            cache.TryGetValue($"{testMockDefFileTitle} 1", out var savedDefinition1);
            cache.TryGetValue($"{testMockDefFileTitle} 2", out var savedDefinition2);

            Assert.NotNull(savedDefinition1);
            Assert.NotNull(savedDefinition2);
        }

        [Fact]
        public void ImportFromMultiplePathsSuccessTest()
        {
            #region Test Setup
            var (mockDefImportService, cache, _) = GetSetupObjects();
            #endregion

            var path1 = Path.Combine(".", "fixtures", "directory_import_test", "mock_definition_1.json");
            var path2 = Path.Combine(".", "fixtures", "mock_definition_valid.json");
            mockDefImportService.ImportFromPath($"{path1},{path2}");

            var ids = GetAddedMockDefinitionsIds(cache);

            Assert.Equal(2, ids.Count());
        }

        [Fact]
        public void ImportFromMultiplePathsSomeInvalidSuccessTest()
        {
            #region Test Setup
            var (mockDefImportService, cache, _) = GetSetupObjects();
            #endregion

            var path1 = Path.Combine(".", "fixtures", "directory_import_test", "mock_definition_1.json");
            var path2 = Path.Combine(".", "fixtures", "mock_def.json");
            mockDefImportService.ImportFromPath($"{path1},{path2}");

            var ids = GetAddedMockDefinitionsIds(cache);

            Assert.Single(ids);
        }

        [Fact]
        public void ImportFromMultiplePathsAllInvalidSuccessTest()
        {
            #region Test Setup
            var (mockDefImportService, cache, _) = GetSetupObjects();
            #endregion

            var path1 = Path.Combine(".", "fixtures", "directory_import_test", "mock_definition_not_exists.json");
            var path2 = Path.Combine(".", "fixtures", "mock_definition_not_exists.json");
            var path3 = Path.Combine(".", "fixtures", "directory_not_exists");
            mockDefImportService.ImportFromPath($"{path1},{path2},{path3}");

            var ids = GetAddedMockDefinitionsIds(cache);

            Assert.Empty(ids);
        }

        [Fact]
        public void ImportFromInvalidFileFailTest()
        {
            #region Test Setup
            var (mockDefImportService, cache, _) = GetSetupObjects();
            #endregion

            var path = Path.Combine(".", "fixtures", "mock_definition_invalid.json");
            mockDefImportService.ImportFromPath(path);

            var actual = cache.Count;
            var expected = 0;

            Assert.Equal(expected, actual);
        }
        
        [Fact]
        public void ImportFromEmptyJsonFileFailTest()
        {
            #region Test Setup
            var (mockDefImportService, cache, _) = GetSetupObjects();
            #endregion

            var path = Path.Combine(".", "fixtures", "mock_definition_empty.json");
            mockDefImportService.ImportFromPath(path);

            var actual = cache.Count;
            var expected = 0;

            Assert.Equal(expected, actual);
        }

        [Fact]
        public void FileNotExistsFailTest()
        {
            #region Test Setup
            var (mockDefImportService, cache, _) = GetSetupObjects();
            #endregion

            var path = Path.Combine(".", "fixtures", "mock_definition_not_exists.json");
            mockDefImportService.ImportFromPath(path);

            var actual = cache.Count;
            var expected = 0;

            Assert.Equal(expected, actual);
        }

        [Fact]
        public void ImportFromAllSuccessTest()
        {
            #region Test Setup
            var path = Path.Combine(".", "fixtures", "mock_definition_valid.json");
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
            var (mockDefImportService, cache, logger) = GetSetupObjects();
            #endregion

            var path = Path.Combine(".", "fixtures", "mock_definition_empty.json");
            mockDefImportService.ImportFromPath(path);

            #pragma warning disable Serilog004 // Constant MessageTemplate verifier
            logger.Received().Error(Arg.Any<string>()); 
            #pragma warning restore Serilog004 // Constant MessageTemplate verifier

            var actual = cache.Count;
            var expected = 0;

            Assert.Equal(expected, actual);
        }

        [Fact]
        public void EmptyLogOutputAsImportWasSuccessfulTest()
        {
            #region Test Setup
            var (mockDefImportService, cache, logger) = GetSetupObjects();
            #endregion

            var path = Path.Combine(".", "fixtures", "mock_definition_valid.json");
            mockDefImportService.ImportFromPath(path);

            #pragma warning disable Serilog004 // Constant MessageTemplate verifier
            logger.DidNotReceive().Error(Arg.Any<string>());
            #pragma warning restore Serilog004 // Constant MessageTemplate verifier

            cache.TryGetValue(testMockDefFileTitle, out var savedDefinition);
            var ids = GetAddedMockDefinitionsIds(cache);

            Assert.NotNull(savedDefinition);
            Assert.Single(ids);
        }

        static IEnumerable<string> GetAddedMockDefinitionsIds(IMemoryCache cache)
        {
            return cache.GetOrCreate(Constants.MOCK_IDS_CACHE_KEY, c => new List<string>());
        }
    }
}
