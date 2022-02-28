using System.Linq;
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
    public class GetAllMockDefinitionsHandlerTests
    {
        [Fact]
        public void GetAllNoEntriesListTest()
        {
            #region Test Setup
            var cache = new MemoryCache(new MemoryCacheOptions());

            var getAllMockDefinitionsCommand = new GetAllMockDefinitionsCommand(ref TestUtils.databaseLock);
            #endregion

            var Target = new GetAllMockDefinitionsHandler(cache);
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

            var cache = new MemoryCache(new MemoryCacheOptions());

            var mockdeffake1 = mockDefinitionFake.Generate();
            var mockdeffake2 = new MockDefinition { Host = mockdeffake1.Host + "diff", Metadata = mockdeffake1.Metadata };

            cache.Set(CommonData.MockIds, new List<string> { mockdeffake1.Metadata.Title, mockdeffake2.Metadata.Title });
            cache.Set(mockdeffake1.Metadata.Title, mockdeffake1);
            cache.Set(mockdeffake2.Metadata.Title, mockdeffake2);

            var getAllMockDefinitionsCommand = new GetAllMockDefinitionsCommand(ref TestUtils.databaseLock);
            #endregion

            var Target = new GetAllMockDefinitionsHandler(cache);
            var Actual = Target.Handle(getAllMockDefinitionsCommand, CancellationToken.None).Result.ToList();

            Assert.Equal(2, Actual.Count);
            Assert.Equal(mockdeffake1.Metadata.Title, Actual[0].Metadata.Title);
            Assert.Equal(mockdeffake2.Metadata.Title, Actual[1].Metadata.Title);
        }
    }
}
