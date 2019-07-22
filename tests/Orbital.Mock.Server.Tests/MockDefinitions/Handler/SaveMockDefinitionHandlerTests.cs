using Bogus;
using Microsoft.Extensions.Caching.Memory;
using NSubstitute;
using Orbital.Mock.Server.Handlers;
using Orbital.Mock.Server.MockDefinitions.Commands;
using Orbital.Mock.Server.Models;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using Xunit;

namespace Orbital.Mock.Server.Tests.MockDefinitions.Handler
{
    public class SaveMockDefinitionHandlerTests
    {
        [Fact]
        public void SaveMockDefinitionSuccessTest()
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

            var mockDefinition = mockDefinitionFake.Generate();
            var saveMockDefinitionCommand = new SaveMockDefinitionCommand(mockDefinition);

            var Target = new SaveMockDefinitionHandler(cache);
            Target.Handle(saveMockDefinitionCommand, CancellationToken.None).Result.ToString();

            cache.TryGetValue(mockDefinition.Metadata.Title, out var savedDefinition);

            Assert.NotNull(savedDefinition);
        }

        [Fact]
        public void SaveMockDefinitionCacheFailedNullTitleTest()
        {
            var metadataFake = new Faker<MetadataInfo>()
            .RuleFor(m => m.Title, f => null)
            .RuleFor(m => m.Description, f => f.Lorem.Paragraph());

            var mockDefinitionFake = new Faker<MockDefinition>()
            .RuleFor(m => m.Host, f => f.Internet.DomainName())
            .RuleFor(m => m.Metadata, f => metadataFake.Generate());

            var options = new MemoryCacheOptions();
            var cache = new MemoryCache(options);

            var mockDefinition = mockDefinitionFake.Generate();
            var saveMockDefinitionCommand = new SaveMockDefinitionCommand(mockDefinition);


            var Target = new SaveMockDefinitionHandler(cache);
            Assert.Throws<ArgumentNullException>(() => Target.Handle(saveMockDefinitionCommand, CancellationToken.None).Result);
        }

        [Fact]
        public void SaveKeysCollectionSuccessTest()
        {
            #region Test Setup

            var metadataFake = new Faker<MetadataInfo>()
                .RuleFor(m => m.Title, f => f.Lorem.Sentence())
                .RuleFor(m => m.Description, f => f.Lorem.Paragraph());

            var mockDefinitionFake = new Faker<MockDefinition>()
                .RuleFor(m => m.Host, f => f.Internet.DomainName())
                .RuleFor(m => m.Metadata, f => metadataFake.Generate());

            const string MOCKTITLEKEY = "mockids";

            var options = new MemoryCacheOptions();
            var cache = new MemoryCache(options);
            var mockDefinition = mockDefinitionFake.Generate();
            var saveMockDefinitionCommand = new SaveMockDefinitionCommand(mockDefinition);
            #endregion

            var Target = new SaveMockDefinitionHandler(cache);
            Target.Handle(saveMockDefinitionCommand, CancellationToken.None).Result.ToString();

            cache.TryGetValue(MOCKTITLEKEY, out List<string> Actual);
            Assert.Contains(mockDefinition.Metadata.Title, Actual);

            Assert.NotNull(Actual);
        }

        [Fact]
        public void SavedTitleExistsInKeyCollections()
        {
            #region test setup
            var metadataFake = new Faker<MetadataInfo>()
               .RuleFor(m => m.Title, f => f.Lorem.Sentence())
               .RuleFor(m => m.Description, f => f.Lorem.Paragraph());

            var mockDefinitionFake = new Faker<MockDefinition>()
                .RuleFor(m => m.Host, f => f.Internet.DomainName())
                .RuleFor(m => m.Metadata, f => metadataFake.Generate());

            const string MOCKTITLEKEY = "mockids";

            var options = new MemoryCacheOptions();
            var cache = new MemoryCache(options);

            #endregion
            var mockDefinition = mockDefinitionFake.Generate();
            var saveMockDefinitionCommand = new SaveMockDefinitionCommand(mockDefinition);
            cache.Set(MOCKTITLEKEY, new List<string> { mockDefinition.Metadata.Title });
            cache.Set(mockDefinition.Metadata.Title, mockDefinition);

            var Target = new SaveMockDefinitionHandler(cache);
            Target.Handle(saveMockDefinitionCommand, CancellationToken.None).Result.ToString();

            cache.TryGetValue(MOCKTITLEKEY, out List<string> Actual);

            Assert.Contains(mockDefinition.Metadata.Title, Actual);

        }
    }
}
