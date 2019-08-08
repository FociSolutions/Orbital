﻿using Bogus;
using FluentValidation.TestHelper;
using Microsoft.OpenApi.Models;
using Orbital.Mock.Server.Models;
using Orbital.Mock.Server.Models.Validators;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Text;
using Xunit;

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
        public void MockDefinitionValidatorHostNullFailureTest()
        {
            var mockDefinitionFake = new Faker<MockDefinition>()
                .RuleFor(m => m.Host, f => null);

            var input = new
            {
                mockDefinition = mockDefinitionFake.Generate()
            };

            var Target = new MockDefinitionValidator();
            Target.ShouldHaveValidationErrorFor(m => m.Host, input.mockDefinition.Host);
        }

        [Fact]
        public void MockDefinitionValidatorHostEmptyFailureTest()
        {
            var mockDefinitionFake = new Faker<MockDefinition>()
                .RuleFor(m => m.Host, f => string.Empty);

            var input = new
            {
                mockDefinition = mockDefinitionFake.Generate()
            };

            var Target = new MockDefinitionValidator();
            Target.ShouldHaveValidationErrorFor(m => m.Host, input.mockDefinition.Host);
        }

        [Fact]
        public void MockDefinitionValidatorBasePathNullFailureTest()
        {
            var mockDefinitionFake = new Faker<MockDefinition>()
                .RuleFor(m => m.BasePath, f => null);

            var input = new
            {
                mockDefinition = mockDefinitionFake.Generate()
            };

            var Target = new MockDefinitionValidator();
            Target.ShouldHaveValidationErrorFor(m => m.BasePath, input.mockDefinition.BasePath);
        }

        [Fact]
        public void MockDefinitionValidatorBasePathEmptyFailureTest()
        {
            var mockDefinitionFake = new Faker<MockDefinition>()
                .RuleFor(m => m.BasePath, f => string.Empty);

            var input = new
            {
                mockDefinition = mockDefinitionFake.Generate()
            };

            var Target = new MockDefinitionValidator();
            Target.ShouldHaveValidationErrorFor(m => m.BasePath, input.mockDefinition.BasePath);
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
