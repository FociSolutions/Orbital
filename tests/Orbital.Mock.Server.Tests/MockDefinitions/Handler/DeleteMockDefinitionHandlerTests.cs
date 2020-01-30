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
using Assert = Xunit.Assert;

namespace Orbital.Mock.Server.Tests.MockDefinitions.Handler
{
    public class DeleteMockDefinitionHandlerTests
    {
        private readonly CommonData data;

        public DeleteMockDefinitionHandlerTests()
        {
            this.data = new CommonData();
        }

        [Fact]
        public void DeleteMockDefinitionHandlerSuccessTest()
        {
            #region TestSetup
            var metadataFake = new Faker<MetadataInfo>()
            .RuleFor(m => m.Title, f => f.Lorem.Sentence())
            .RuleFor(m => m.Description, f => f.Lorem.Paragraph());

            var mockDefinitionFake = new Faker<MockDefinition>()
            .RuleFor(m => m.Host, f => f.Internet.DomainName())
            .RuleFor(m => m.Metadata, f => metadataFake.Generate());

            var options = new MemoryCacheOptions();
            var cache = new MemoryCache(options);

            var mockDefinition = mockDefinitionFake.Generate();
            cache.Set(mockDefinition.Metadata.Title, mockDefinition);

            var deleteMockDefinitionCommand = new DeleteMockDefinitionByTitleCommand(mockDefinition.Metadata.Title);
            #endregion

            var Target = new DeleteMockDefinitionHandler(cache, data);
            var Actual = Target.Handle(deleteMockDefinitionCommand, CancellationToken.None).Result;

            cache.TryGetValue(mockDefinition.Metadata.Title, out var savedDefinition);

            Assert.Null(savedDefinition);
        }

        [Fact]
        public void DeleteMockDefinitionHandlerNotFoundTest()
        {
            #region TestSetup
            var options = new MemoryCacheOptions();
            var cache = new MemoryCache(options);
            var faker = new Faker();
            var deleteMockDefinitionCommand = new DeleteMockDefinitionByTitleCommand(faker.Random.AlphaNumeric(40));
            #endregion
            var Target = new DeleteMockDefinitionHandler(cache, data);
            var exception = Record.Exception(() => Target.Handle(deleteMockDefinitionCommand, CancellationToken.None).Result);

            Assert.Null(exception);
        }

        [Fact]
        public void DeleteMockDefinitionHandlerFromListSuccessTest()
        {
            #region TestSetup
            var metadataFake = new Faker<MetadataInfo>()
            .RuleFor(m => m.Title, f => f.Lorem.Sentence())
            .RuleFor(m => m.Description, f => f.Lorem.Paragraph());

            var mockDefinitionFake = new Faker<MockDefinition>()
            .RuleFor(m => m.Host, f => f.Internet.DomainName())
            .RuleFor(m => m.Metadata, f => metadataFake.Generate());

            var options = new MemoryCacheOptions();
            var cache = new MemoryCache(options);

            var mockDefinition = mockDefinitionFake.Generate();
            cache.Set(mockDefinition.Metadata.Title, mockDefinition);

            var expected = mockDefinition.Metadata.Title;
            cache.Set(data.mockIds, new List<string>() { mockDefinition.Metadata.Title });

            var deleteMockDefinitionCommand = new DeleteMockDefinitionByTitleCommand(mockDefinition.Metadata.Title);
            #endregion
            var Target = new DeleteMockDefinitionHandler(cache, data);
            Target.Handle(deleteMockDefinitionCommand, CancellationToken.None);

            cache.TryGetValue(mockDefinition.Metadata.Title, out var Actual);

            Assert.Null(Actual);
        }
    }
}
