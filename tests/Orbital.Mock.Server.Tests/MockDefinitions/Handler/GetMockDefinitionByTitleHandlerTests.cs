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
    public class GetMockDefinitionByTitleHandlerTests
    {
        [Fact]
        public void GetMockDefinitionTitleHandlesSucessTest()
        {
            #region Test Setup

            var metadataFake = new Faker<MetadataInfo>()
            .RuleFor(m => m.Title, f => f.Lorem.Sentence())
            .RuleFor(m => m.Description, f => f.Lorem.Paragraph());

            var mockDefinitionFake = new Faker<MockDefinition>()
            .RuleFor(m => m.Host, f => f.Internet.DomainName())
            .RuleFor(m => m.Metadata, f => metadataFake.Generate());

            var mockDefinition = mockDefinitionFake.Generate();

            var options = new MemoryCacheOptions();
            var cache = new MemoryCache(options);

            cache.Set(mockDefinition.Metadata.Title, mockDefinition);
            var getMockDefinitionCommand = new GetMockDefinitionByTitleCommand(mockDefinition.Metadata.Title);
            #endregion

            var Target = new GetMockDefinitionByTitleHandler(cache);
            var Actual = Target.Handle(getMockDefinitionCommand, CancellationToken.None).Result;

            Assert.Equal(mockDefinition, Actual);
        }



    }
}
