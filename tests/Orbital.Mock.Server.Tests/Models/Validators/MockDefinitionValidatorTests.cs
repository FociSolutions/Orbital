using System.Collections;
using System.Collections.Generic;

using Microsoft.OpenApi.Models;

using Orbital.Mock.Definition;
using Orbital.Mock.Definition.Validators;

using Bogus;
using Xunit;
using FluentValidation.TestHelper;

namespace Orbital.Mock.Server.Tests.Models.Validators
{
    public class MockDefinitionValidatorTests
    {
        [Theory]
        [ClassData(typeof(MockDefinitionValidatorTestData))]
        public void MockDefinitionValidatorSuccessTest(string host)
        {
            var mockDefinitionFake = new Faker<MockDefinition>()
                .RuleFor(m => m.Host, f => host);

            var input = new
            {
                mockDefinition = mockDefinitionFake.Generate(10)
            };

            var Target = new MockDefinitionValidator();

            foreach (var item in input.mockDefinition)
            {
                Target.ShouldNotHaveValidationErrorFor(m => m.Host, item.Host);
            }
        }

        [Fact]
        public void MockDefinitionValidatorHostNullSuccessTest()
        {
            var mockDefinitionFake = new Faker<MockDefinition>()
                .RuleFor(m => m.Host, f => null);

            var input = new
            {
                mockDefinition = mockDefinitionFake.Generate()
            };

            var Target = new MockDefinitionValidator();
            Target.ShouldNotHaveValidationErrorFor(m => m.Host, input.mockDefinition.Host);
        }

        [Fact]
        public void MockDefinitionValidatorHostEmptySuccessTest()
        {
            var mockDefinitionFake = new Faker<MockDefinition>()
                .RuleFor(m => m.Host, f => string.Empty);

            var input = new
            {
                mockDefinition = mockDefinitionFake.Generate()
            };

            var Target = new MockDefinitionValidator();
            Target.ShouldNotHaveValidationErrorFor(m => m.Host, input.mockDefinition.Host);
        }

        [Fact]
        public void MockDefinitionValidatorBasePathNullSuccessTest()
        {
            var mockDefinitionFake = new Faker<MockDefinition>()
                .RuleFor(m => m.BasePath, f => null);

            var input = new
            {
                mockDefinition = mockDefinitionFake.Generate()
            };

            var Target = new MockDefinitionValidator();
            Target.ShouldNotHaveValidationErrorFor(m => m.BasePath, input.mockDefinition.BasePath);
        }

        [Fact]
        public void MockDefinitionValidatorBasePathEmptySuccessTest()
        {
            var mockDefinitionFake = new Faker<MockDefinition>()
                .RuleFor(m => m.BasePath, f => string.Empty);

            var input = new
            {
                mockDefinition = mockDefinitionFake.Generate()
            };

            var Target = new MockDefinitionValidator();
            Target.ShouldNotHaveValidationErrorFor(m => m.BasePath, input.mockDefinition.BasePath);
        }

        [Fact]
        public void MockDefinitionValidatorOpenApiNullFailureTest()
        {
            var mockDefinitionFake = new Faker<MockDefinition>()
                .RuleFor(m => m.OpenApi, f => null);

            var input = new
            {
                mockDefinition = mockDefinitionFake.Generate()
            };

            var Target = new MockDefinitionValidator();
            Target.ShouldHaveValidationErrorFor(m => m.OpenApi, input.mockDefinition.OpenApi);
        }

        [Fact]
        public void MockDefinitionValidatorOpenApiValidationFailureTest()
        {
            var mockDefinitionFake = new Faker<MockDefinition>()
                .RuleFor(m => m.OpenApi, f => new OpenApiDocument { });

            var input = new
            {
                mockDefinition = mockDefinitionFake.Generate()
            };

            var Target = new MockDefinitionValidator();
            Target.ShouldHaveValidationErrorFor(m => m.OpenApi, input.mockDefinition.OpenApi);
        }
    }

    public class MockDefinitionValidatorTestData : IEnumerable<object[]>
    {
        private Faker faker;

        public MockDefinitionValidatorTestData()
        {
            this.faker = new Faker();
        }


        public IEnumerator<object[]> GetEnumerator()
        {
            yield return new object[] { faker.Internet.DomainName() };
            yield return new object[] { faker.Internet.Ip() };
            yield return new object[] { faker.Internet.Ipv6() };
        }

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();
    }
}
