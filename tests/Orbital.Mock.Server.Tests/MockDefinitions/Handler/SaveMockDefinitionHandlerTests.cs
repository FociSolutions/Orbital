using Bogus;
using Microsoft.Extensions.Caching.Memory;
using Orbital.Mock.Server.Handlers;
using Orbital.Mock.Server.MockDefinitions.Commands;
using Orbital.Mock.Server.Models;
using System;
using System.Collections.Generic;
using System.Threading;
using Xunit;
using Assert = Xunit.Assert;

namespace Orbital.Mock.Server.Tests.MockDefinitions.Handler
{
    public class SaveMockDefinitionHandlerTests
    {
        private readonly CommonData data;
        private Faker<MockDefinition> mockDefinitionFake;

        public SaveMockDefinitionHandlerTests()
        {
            this.data = new CommonData();
            var metadataFake = new Faker<MetadataInfo>()
            .RuleFor(m => m.Title, f => f.Lorem.Sentence())
            .RuleFor(m => m.Description, f => f.Lorem.Paragraph());
            this.mockDefinitionFake = new Faker<MockDefinition>()
            .RuleFor(m => m.Host, f => f.Internet.DomainName())
            .RuleFor(m => m.Metadata, f => metadataFake.Generate());
        }
        [Fact]
        public void SaveMockDefinitionSuccessTest()
        {
            #region Test Setup
            var options = new MemoryCacheOptions();
            var cache = new MemoryCache(options);
            #endregion

            var mockDefinition = mockDefinitionFake.Generate();
            var saveMockDefinitionCommand = new SaveMockDefinitionCommand(mockDefinition);

            var Target = new SaveMockDefinitionHandler(cache, data);
            Target.Handle(saveMockDefinitionCommand, CancellationToken.None).Result.ToString();

            cache.TryGetValue(mockDefinition.Metadata.Title, out var savedDefinition);

            Assert.NotNull(savedDefinition);
        }

        [Fact]
        public void SaveMockDefinitionCacheFailedNullTitleTest()
        {
            #region Test Setup
            var options = new MemoryCacheOptions();
            var cache = new MemoryCache(options);
            var mockDefinition = mockDefinitionFake.Generate();
            mockDefinition.Metadata.Title = null;

            var input = new
            {
                mockDefinition
            };
            #endregion

            var saveMockDefinitionCommand = new SaveMockDefinitionCommand(input.mockDefinition);


            var Target = new SaveMockDefinitionHandler(cache, data);
            Assert.Throws<ArgumentNullException>(() => Target.Handle(saveMockDefinitionCommand, CancellationToken.None).Result);
        }

        [Fact]
        public void SaveKeysCollectionSuccessTest()
        {
            #region Test Setup
            var options = new MemoryCacheOptions();
            var cache = new MemoryCache(options);
            #endregion
            var mockDefinition = mockDefinitionFake.Generate();
            var saveMockDefinitionCommand = new SaveMockDefinitionCommand(mockDefinition);
            var Target = new SaveMockDefinitionHandler(cache, data);
            Target.Handle(saveMockDefinitionCommand, CancellationToken.None).Result.ToString();

            cache.TryGetValue(data.mockIds, out List<string> Actual);
            Assert.Contains(mockDefinition.Metadata.Title, Actual);
        }

        [Fact]
        public void SavedTitleExistsInKeyCollections()
        {
            #region test setup
            var options = new MemoryCacheOptions();
            var cache = new MemoryCache(options);
            #endregion
            var mockDefinition = mockDefinitionFake.Generate();
            var saveMockDefinitionCommand = new SaveMockDefinitionCommand(mockDefinition);
            cache.Set(data.mockIds, new List<string> { mockDefinition.Metadata.Title });
            cache.Set(mockDefinition.Metadata.Title, mockDefinition);

            var Target = new SaveMockDefinitionHandler(cache, data);
            Target.Handle(saveMockDefinitionCommand, CancellationToken.None).Result.ToString();

            cache.TryGetValue(data.mockIds, out List<string> Actual);

            Assert.Contains(mockDefinition.Metadata.Title, Actual);

        }
    }
}
