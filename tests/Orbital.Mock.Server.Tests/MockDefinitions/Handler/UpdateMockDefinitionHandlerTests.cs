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
            var updateMockDefinitionCommand = new UpdateMockDefinitionByTitleCommand(Expected);

            var Target = new UpdateMockDefinitionHandler(cache);
            Target.Handle(updateMockDefinitionCommand, CancellationToken.None);

            cache.TryGetValue(Expected.Metadata.Title, out var Actual);

            Assert.Equal(Actual, Expected);


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

            var Target = new UpdateMockDefinitionHandler(cache);
            var Actual = Target.Handle(updateMockDefinitionCommand, CancellationToken.None).Result;


            Assert.Equal(Actual, Expected);


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

            var Target = new UpdateMockDefinitionHandler(cache);
            var Actual = Target.Handle(updateMockDefinitionCommand, CancellationToken.None).Result;


            Assert.Null(Actual);


        }
    }

}
