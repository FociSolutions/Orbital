using Bogus;
using Microsoft.Extensions.Caching.Memory;
using Orbital.Mock.Server.MockDefinitions.Commands;
using Orbital.Mock.Server.MockDefinitions.Handlers;
using Orbital.Mock.Server.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using Xunit;
using Assert = Xunit.Assert;

namespace Orbital.Mock.Server.Tests.MockDefinitions.Handler
{
    public class GetAllMockDefinitionsHandlerTests
    {
        private readonly CommonData data;

        public GetAllMockDefinitionsHandlerTests()
        {
            this.data = new CommonData();
        }
        [Fact]
        public void GetAllNoEntriesListTest()
        {
            #region Test Setup

            var options = new MemoryCacheOptions();
            var cache = new MemoryCache(options);

            var getAllMockDefinitionsCommand = new GetAllMockDefinitionsCommand();
            #endregion

            var Target = new GetAllMockDefinitionsHandler(cache, data);
            var Actual = Target.Handle(getAllMockDefinitionsCommand, CancellationToken.None).Result;

            Assert.Empty(Actual);
        }

        [Fact]
        public void GetAllEntriesSuccessTest()
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

            var mockdeffake1 = mockDefinitionFake.Generate();
            var mockdeffake2 = new MockDefinition { Host = mockdeffake1.Host + "diff", Metadata = mockdeffake1.Metadata };

            cache.Set(data.mockIds, new List<string> { mockdeffake1.Metadata.Title, mockdeffake2.Metadata.Title });
            cache.Set(mockdeffake1.Metadata.Title, mockdeffake1);
            cache.Set(mockdeffake2.Metadata.Title, mockdeffake2);

            var getAllMockDefinitionsCommand = new GetAllMockDefinitionsCommand();

            var Target = new GetAllMockDefinitionsHandler(cache, data);
            var Actual = Target.Handle(getAllMockDefinitionsCommand, CancellationToken.None).Result.ToList();

            Assert.Equal(2, Actual.Count);
            Assert.Equal(mockdeffake1.Metadata.Title, Actual[0].Metadata.Title);
            Assert.Equal(mockdeffake2.Metadata.Title, Actual[1].Metadata.Title);

            #endregion
        }
    }
}
