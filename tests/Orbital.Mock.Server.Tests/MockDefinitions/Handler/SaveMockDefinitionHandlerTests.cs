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
            var Actual = Target.Handle(saveMockDefinitionCommand, CancellationToken.None).Result;
                        
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

            var mockKeysCollections = new Faker<MockDefinition>()
                .RuleFor(m => m.Host, f => f.Internet.DomainName())
                .RuleFor(m => m.Metadata, f => metadataFake.Generate());

            var options = new MemoryCacheOptions();
            var cache = new MemoryCache(options);

            var mockDefinition = mockKeysCollections.Generate();
            cache.Set(mockDefinition.Metadata.Title, mockDefinition);
            #endregion

            cache.Set("mockids", new List<string>() { mockDefinition.Metadata.Title });
            cache.TryGetValue(mockDefinition.Metadata.Title, out var Actual);

            Assert.NotNull(Actual);

        }
    }
}
