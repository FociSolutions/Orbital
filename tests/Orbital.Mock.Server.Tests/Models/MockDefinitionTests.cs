using Bogus;
using Microsoft.OpenApi.Models;
using Orbital.Mock.Server.Models;
using System;
using Xunit;
using Assert = Xunit.Assert;

namespace Orbital.Mock.Server.Tests.Models
{
    public class MockDefinitionTests
    {
        private Faker<MockDefinition> mockDefinitionFake;

        public MockDefinitionTests()
        {
            var metadataFake = new Faker<MetadataInfo>()
            .RuleFor(m => m.Title, f => f.Lorem.Sentence())
            .RuleFor(m => m.Description, f => f.Lorem.Paragraph());

            this.mockDefinitionFake = new Faker<MockDefinition>()
            .RuleFor(m => m.Host, f => f.Internet.DomainName())
            .RuleFor(m => m.Metadata, f => metadataFake.Generate())
            .RuleFor(m => m.BasePath, f => f.Random.AlphaNumeric(TestUtils.GetRandomStringLength()))
            .RuleFor(m => m.OpenApi, f => new OpenApiDocument { });
        }
        [Fact]
        public void EqualsSuccessTest()
        {
            var Target = mockDefinitionFake.Generate();

            var input = new
            {
                objTest = Target as Object
            };

            var Actual = Target.Equals(input.objTest);
            Assert.True(Actual);
        }


        [Fact]
        public void EqualsFailsNullTest()
        {
            var Target = mockDefinitionFake.Generate();

            var Actual = Target.Equals(null);
            Assert.False(Actual);
        }

        [Fact]
        public void EqualsFailsHostTest()
        {
            var Target = mockDefinitionFake.Generate();

            var input = new
            {
                mockDefinitionTest = new MockDefinition
                {
                    Metadata = Target.Metadata,
                    BasePath = Target.BasePath,
                    OpenApi = Target.OpenApi
                }
            };

            var Actual = Target.Equals(input.mockDefinitionTest);
            Assert.False(Actual);
        }

        [Fact]
        public void EqualsFailsMetadataInfoTest()
        {
            var Target = mockDefinitionFake.Generate();

            var input = new
            {
                mockDefinitionTest = new MockDefinition
                {
                    Host = Target.Host,
                    BasePath = Target.BasePath,
                    OpenApi = Target.OpenApi
                }
            };

            var Actual = Target.Equals(input.mockDefinitionTest);
            Assert.False(Actual);
        }

        [Fact]
        public void EqualsFailsBasePathTest()
        {
            var Target = mockDefinitionFake.Generate();

            var input = new
            {
                mockDefinitionTest = new MockDefinition
                {
                    Metadata = Target.Metadata,
                    Host = Target.Host,
                    OpenApi = Target.OpenApi
                }
            };
            var Actual = Target.Equals(input.mockDefinitionTest);
            Assert.False(Actual);
        }

        [Fact]
        public void EqualsFailsOpenApiTest()
        {
            var Target = mockDefinitionFake.Generate();

            var input = new
            {
                mockDefinitionTest = new MockDefinition
                {
                    Metadata = Target.Metadata,
                    Host = Target.Host,
                    BasePath = Target.BasePath
                }
            };
            var Actual = Target.Equals(input.mockDefinitionTest);
            Assert.False(Actual);
        }
    }
}
