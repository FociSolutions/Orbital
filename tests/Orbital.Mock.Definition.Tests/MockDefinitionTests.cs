using System;

using Microsoft.OpenApi.Models;

using Bogus;
using Xunit;
using Assert = Xunit.Assert;
using Newtonsoft.Json;

namespace Orbital.Mock.Definition.Tests
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
            .RuleFor(m => m.OpenApi, f => new OpenApiDocument { })
            .RuleFor(m => m.TokenValidation, f => true);
            
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
                    OpenApi = Target.OpenApi,
                    TokenValidation = Target.TokenValidation
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
                    OpenApi = Target.OpenApi,
                    TokenValidation = Target.TokenValidation
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
                    OpenApi = Target.OpenApi,
                    TokenValidation = Target.TokenValidation
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
                    BasePath = Target.BasePath,
                    TokenValidation = Target.TokenValidation
                }
            };
            var Actual = Target.Equals(input.mockDefinitionTest);
            Assert.False(Actual);
        }

        [Fact]
        public void CreateFromFileSuccessfully()
        {
            #region Test Setup
            var fileName = System.IO.Path.Combine("..", "..", "..", "MockDefinitions", "pet_store_tests.json");
            var expectedTitle = "Pet Store Tests";
            var expectedDescription = "This is to pass into Unit Tests.";
            #endregion

            var mockDef = MockDefinition.CreateFromFile(fileName);

            Assert.Equal(expectedTitle, mockDef.Metadata.Title);
            Assert.Equal(expectedDescription, mockDef.Metadata.Description);
            Assert.NotNull(mockDef);
        }

        [Fact]
        public void CreateFromEmptyStringFailTest()
        {
            Assert.Throws<JsonSerializationException>(() => MockDefinition.CreateFromJsonString(""));
        }
    }
}
