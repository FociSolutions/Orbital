using System.Threading;
using System.Collections.Generic;

using Microsoft.Extensions.Caching.Memory;

using Orbital.Mock.Definition;

using Orbital.Mock.Server.MockDefinitions.Commands;
using Orbital.Mock.Server.MockDefinitions.Handlers;

using Bogus;
using Xunit;
using Assert = Xunit.Assert;

namespace Orbital.Mock.Server.Tests.MockDefinitions.Handler
{
    public class UpdateMockDefinitionHandlerTests
    {

        public UpdateMockDefinitionHandlerTests()
        { }

        [Fact]
        public void UpdateMockDefinitionSuccessTest()
        {
            #region Test Setup

            var metadataFake = new Faker<MetadataInfo>()
                .RuleFor(m => m.Title, f => f.Lorem.Sentence())
                .RuleFor(m => m.Description, f => f.Lorem.Paragraph());

            var mockDefinitionFake = new Faker<MockDefinition>()
                .RuleFor(m => m.Host, f => f.Internet.DomainName())
                .RuleFor(m => m.Metadata, f => metadataFake.Generate());

            var options = new MemoryCacheOptions();
            var cache = new MemoryCache(options);

            var mockDefinition = mockDefinitionFake.Generate();
            var Expected = new MockDefinition { Host = mockDefinition.Host + "diff", Metadata = mockDefinition.Metadata };

            cache.Set(mockDefinition.Metadata.Title, mockDefinition);

            var updateMockDefinitionCommand = new UpdateMockDefinitionByTitleCommand(Expected, ref TestUtils.databaseLock);
            #endregion

            var Target = new UpdateMockDefinitionHandler(cache);
            Target.Handle(updateMockDefinitionCommand, CancellationToken.None);

            cache.TryGetValue(Expected.Metadata.Title, out var Actual);

            Assert.Equal(Expected, Actual);
        }

        [Fact]
        public void UpdateMockDefinitionCreatedSuccessTest()
        {
            #region Test Setup

            var metadataFake = new Faker<MetadataInfo>()
                .RuleFor(m => m.Title, f => f.Lorem.Sentence())
                .RuleFor(m => m.Description, f => f.Lorem.Paragraph());

            var mockDefinitionFake = new Faker<MockDefinition>()
                .RuleFor(m => m.Host, f => f.Internet.DomainName())
                .RuleFor(m => m.Metadata, f => metadataFake.Generate());

            var options = new MemoryCacheOptions();
            var cache = new MemoryCache(options);
            #endregion

            var Expected = mockDefinitionFake.Generate();
            var updateMockDefinitionCommand = new UpdateMockDefinitionByTitleCommand(Expected, ref TestUtils.databaseLock);

            var Target = new UpdateMockDefinitionHandler(cache);
            Target.Handle(updateMockDefinitionCommand, CancellationToken.None);

            cache.TryGetValue(Expected.Metadata.Title, out var Actual);

            Assert.Equal(Expected, Actual);
        }

        [Fact]
        public void UpdateHandlerReturnsNewMockDefinitionTest()
        {
            #region Test Setup

            var metadataFake = new Faker<MetadataInfo>()
                .RuleFor(m => m.Title, f => f.Lorem.Sentence())
                .RuleFor(m => m.Description, f => f.Lorem.Paragraph());

            var mockDefinitionFake = new Faker<MockDefinition>()
                .RuleFor(m => m.Host, f => f.Internet.DomainName())
                .RuleFor(m => m.Metadata, f => metadataFake.Generate());

            var options = new MemoryCacheOptions();
            var cache = new MemoryCache(options);

            var mockDef = mockDefinitionFake.Generate();

            cache.Set(mockDef.Metadata.Title, mockDef);

            var Expected = mockDef;
            Expected.Host = mockDef.Host + "diff";

            var updateMockDefinitionCommand = new UpdateMockDefinitionByTitleCommand(Expected, ref TestUtils.databaseLock);
            #endregion

            var Target = new UpdateMockDefinitionHandler(cache);
            var Actual = Target.Handle(updateMockDefinitionCommand, CancellationToken.None).Result;


            Assert.Equal(Expected, Actual);
        }

        [Fact]
        public void UpdateHandlerReturnsNullTest()
        {
            #region Test Setup

            var metadataFake = new Faker<MetadataInfo>()
                .RuleFor(m => m.Title, f => f.Lorem.Sentence())
                .RuleFor(m => m.Description, f => f.Lorem.Paragraph());

            var mockDefinitionFake = new Faker<MockDefinition>()
                .RuleFor(m => m.Host, f => f.Internet.DomainName())
                .RuleFor(m => m.Metadata, f => metadataFake.Generate());

            var options = new MemoryCacheOptions();
            var cache = new MemoryCache(options);

            var mockDefinitionUpdate = mockDefinitionFake.Generate();

            var updateMockDefinitionCommand = new UpdateMockDefinitionByTitleCommand(mockDefinitionUpdate, ref TestUtils.databaseLock);
            #endregion

            var Target = new UpdateMockDefinitionHandler(cache);
            var Actual = Target.Handle(updateMockDefinitionCommand, CancellationToken.None).Result;


            Assert.Null(Actual);
        }


        [Fact]
        public void UpdateKeysCollectionSuccessTest()
        {
            #region Test Setup

            var metadataFake = new Faker<MetadataInfo>()
                .RuleFor(m => m.Title, f => f.Lorem.Sentence())
                .RuleFor(m => m.Description, f => f.Lorem.Paragraph());

            var mockDefinitionFake = new Faker<MockDefinition>()
                .RuleFor(m => m.Host, f => f.Internet.DomainName())
                .RuleFor(m => m.Metadata, f => metadataFake.Generate());

            var options = new MemoryCacheOptions();
            var cache = new MemoryCache(options);

            var input = new { mockDefinition = mockDefinitionFake.Generate() };

            var updateMockDefinitionCommand = new UpdateMockDefinitionByTitleCommand(input.mockDefinition, ref TestUtils.databaseLock);
            #endregion

            var Target = new UpdateMockDefinitionHandler(cache);
            Target.Handle(updateMockDefinitionCommand, CancellationToken.None);

            var Actual = cache.Get<List<string>>(Constants.MOCK_IDS_CACHE_KEY);

            Assert.Contains(input.mockDefinition.Metadata.Title, Actual);
        }

        [Fact]
        public void UpdateKeysCollectionExistingKeySuccessTest()
        {
            #region Test Setup

            var metadataFake = new Faker<MetadataInfo>()
                .RuleFor(m => m.Title, f => f.Lorem.Sentence())
                .RuleFor(m => m.Description, f => f.Lorem.Paragraph());

            var mockDefinitionFake = new Faker<MockDefinition>()
                .RuleFor(m => m.Host, f => f.Internet.DomainName())
                .RuleFor(m => m.Metadata, f => metadataFake.Generate());

            var options = new MemoryCacheOptions();
            var cache = new MemoryCache(options);

            var input = new { mockDefinition = mockDefinitionFake.Generate() };

            var updateMockDefinitionCommand = new UpdateMockDefinitionByTitleCommand(input.mockDefinition, ref TestUtils.databaseLock);
            #endregion

            cache.Set(input.mockDefinition.Metadata.Title, input.mockDefinition);
            cache.Set(Constants.MOCK_IDS_CACHE_KEY, new List<string> { input.mockDefinition.Metadata.Title });
            var Target = new UpdateMockDefinitionHandler(cache);
            Target.Handle(updateMockDefinitionCommand, CancellationToken.None);

            var Actual = cache.Get<List<string>>(Constants.MOCK_IDS_CACHE_KEY);

            Assert.Contains(input.mockDefinition.Metadata.Title, Actual);
        }
    }

}
