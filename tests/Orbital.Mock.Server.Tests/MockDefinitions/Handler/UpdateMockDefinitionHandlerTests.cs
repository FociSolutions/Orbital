using Bogus;
using Microsoft.Extensions.Caching.Memory;
using Orbital.Mock.Server.MockDefinitions.Commands;
using Orbital.Mock.Server.MockDefinitions.Handlers;
using Orbital.Mock.Server.Models;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using Xunit;

namespace Orbital.Mock.Server.Tests.MockDefinitions.Handler
{
    public class UpdateMockDefinitionHandlerTests
    {
        private readonly CommonData data;

        public UpdateMockDefinitionHandlerTests()
        {
            this.data = new CommonData();
        }
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

            var updateMockDefinitionCommand = new UpdateMockDefinitionByTitleCommand(Expected);
            #endregion

            var Target = new UpdateMockDefinitionHandler(cache, data);
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
            var updateMockDefinitionCommand = new UpdateMockDefinitionByTitleCommand(Expected);

            var Target = new UpdateMockDefinitionHandler(cache, data);
            Target.Handle(updateMockDefinitionCommand, CancellationToken.None);

            cache.TryGetValue(Expected.Metadata.Title, out var Actual);

            Assert.Equal(Expected, Actual);
        }

        [Fact]
        public void UpdateHandlerReturnsMockDefinitionTest()
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

            var Expected = mockDefinitionFake.Generate();
            var mockDefinitionUpdate = new MockDefinition { Host = Expected.Host + "diff", Metadata = Expected.Metadata };

            cache.Set(Expected.Metadata.Title, Expected);

            var updateMockDefinitionCommand = new UpdateMockDefinitionByTitleCommand(mockDefinitionUpdate);
            #endregion

            var Target = new UpdateMockDefinitionHandler(cache, data);
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

            var updateMockDefinitionCommand = new UpdateMockDefinitionByTitleCommand(mockDefinitionUpdate);
            #endregion

            var Target = new UpdateMockDefinitionHandler(cache, data);
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

            var updateMockDefinitionCommand = new UpdateMockDefinitionByTitleCommand(input.mockDefinition);
            #endregion

            var Target = new UpdateMockDefinitionHandler(cache, data);
            Target.Handle(updateMockDefinitionCommand, CancellationToken.None);

            var Actual = cache.Get<List<string>>(data.mockIds);

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

            var updateMockDefinitionCommand = new UpdateMockDefinitionByTitleCommand(input.mockDefinition);
            #endregion

            cache.Set(input.mockDefinition.Metadata.Title, input.mockDefinition);
            cache.Set(data.mockIds, new List<string> { input.mockDefinition.Metadata.Title });
            var Target = new UpdateMockDefinitionHandler(cache, data);
            Target.Handle(updateMockDefinitionCommand, CancellationToken.None);

            var Actual = cache.Get<List<string>>(data.mockIds);

            Assert.Contains(input.mockDefinition.Metadata.Title, Actual);
        }
    }

}
