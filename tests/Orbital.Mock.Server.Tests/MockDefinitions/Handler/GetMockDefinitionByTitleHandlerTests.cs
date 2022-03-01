using System.Threading;

using Microsoft.Extensions.Caching.Memory;

using Orbital.Mock.Definition;

using Orbital.Mock.Server.MockDefinitions.Commands;
using Orbital.Mock.Server.MockDefinitions.Handlers;

using Bogus;
using Xunit;
using Assert = Xunit.Assert;

namespace Orbital.Mock.Server.Tests.MockDefinitions.Handler
{
    public class GetMockDefinitionByTitleHandlerTests
    {
        [Fact]
        public void GetMockDefinitionTitleHandlerSucessTest()
        {
            #region Test Setup

            var metadataFake = new Faker<MetadataInfo>()
            .RuleFor(m => m.Title, f => f.Lorem.Sentence())
            .RuleFor(m => m.Description, f => f.Lorem.Paragraph());

            var mockDefinitionFake = new Faker<MockDefinition>()
            .RuleFor(m => m.Host, f => f.Internet.DomainName())
            .RuleFor(m => m.Metadata, f => metadataFake.Generate());

            var input = new
            {
                mockDefinition = mockDefinitionFake.Generate()
            };

            var options = new MemoryCacheOptions();
            var cache = new MemoryCache(options);

            cache.Set(input.mockDefinition.Metadata.Title, input.mockDefinition);
            var getMockDefinitionCommand = new GetMockDefinitionByTitleCommand(input.mockDefinition.Metadata.Title, ref TestUtils.databaseLock);
            #endregion

            var Target = new GetMockDefinitionByTitleHandler(cache);
            var Actual = Target.Handle(getMockDefinitionCommand, CancellationToken.None).Result;

            Assert.Equal(input.mockDefinition, Actual);
        }

        [Fact]
        public void GetMockDefinitionTitleHandlerFailedTest()
        {
            #region Test Setup
            var faker = new Faker();

            var options = new MemoryCacheOptions();
            var cache = new MemoryCache(options);

            var input = new
            {
                title = faker.Random.AlphaNumeric(40)
            };

            var getMockDefinitionCommand = new GetMockDefinitionByTitleCommand(input.title, ref TestUtils.databaseLock);
            #endregion

            var Target = new GetMockDefinitionByTitleHandler(cache);
            var Actual = Target.Handle(getMockDefinitionCommand, CancellationToken.None).Result;

            Assert.Null(Actual);
        }
    }
}
