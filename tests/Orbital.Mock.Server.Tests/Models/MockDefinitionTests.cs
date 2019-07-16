using Bogus;
using Orbital.Mock.Server.Models;
using System;
using System.Collections.Generic;
using System.Text;
using Xunit;

namespace Orbital.Mock.Server.Tests.Models
{
    public class MockDefinitionTests
    {
        [Fact]
        public void EqualsSuccessTest()
        {
            #region Test Setup
            var metadataFake = new Faker<MetadataInfo>()
            .RuleFor(m => m.Title, f => f.Lorem.Sentence())
            .RuleFor(m => m.Description, f => f.Lorem.Paragraph());

            var mockDefinitionFake = new Faker<MockDefinition>()
            .RuleFor(m => m.Host, f => f.Internet.DomainName())
            .RuleFor(m => m.Metadata, f => metadataFake.Generate());


            var mockDefinitionInfo = mockDefinitionFake.Generate();

            var input = new
            {
                objTest = mockDefinitionInfo as Object
            };

            #endregion

            var Actual = mockDefinitionInfo.Equals(input.objTest);
            Assert.True(Actual);
        }


        [Fact]
        public void EqualsFailsNullTest()
        {
            #region Test Setup
            var metadataFake = new Faker<MetadataInfo>()
            .RuleFor(m => m.Title, f => f.Lorem.Sentence())
            .RuleFor(m => m.Description, f => f.Lorem.Paragraph());

            var mockDefinitionFake = new Faker<MockDefinition>()
            .RuleFor(m => m.Host, f => f.Internet.DomainName())
            .RuleFor(m => m.Metadata, f => metadataFake.Generate());


            var mockDefinitionInfo = mockDefinitionFake.Generate();

            #endregion

            var Actual = mockDefinitionInfo.Equals(null);
            Assert.False(Actual);
        }

        [Fact]
        public void EqualsFailsHostTest()
        {
            #region Test Setup
            var metadataFake = new Faker<MetadataInfo>()
            .RuleFor(m => m.Title, f => f.Lorem.Sentence())
            .RuleFor(m => m.Description, f => f.Lorem.Paragraph());

            var mockDefinitionFake = new Faker<MockDefinition>()
            .RuleFor(m => m.Host, f => f.Internet.DomainName())
            .RuleFor(m => m.Metadata, f => metadataFake.Generate());


            var mockDefinitionInfo = mockDefinitionFake.Generate();

            var input = new
            {
                mockDefinitionTest = new MockDefinition { Metadata = mockDefinitionInfo.Metadata }
            };


            #endregion

            var Actual = mockDefinitionInfo.Equals(input.mockDefinitionTest);
            Assert.False(Actual);
        }

        [Fact]
        public void EqualsFailsMetadataInfoTest()
        {
            #region Test Setup
            var metadataFake = new Faker<MetadataInfo>()
            .RuleFor(m => m.Title, f => f.Lorem.Sentence())
            .RuleFor(m => m.Description, f => f.Lorem.Paragraph());

            var mockDefinitionFake = new Faker<MockDefinition>()
            .RuleFor(m => m.Host, f => f.Internet.DomainName())
            .RuleFor(m => m.Metadata, f => metadataFake.Generate());


            var mockDefinitionInfo = mockDefinitionFake.Generate();

            var input = new
            {
                mockDefinitionTest = new MockDefinition { Host = mockDefinitionInfo.Host }
            };


            #endregion

            var Actual = mockDefinitionInfo.Equals(input.mockDefinitionTest);
            Assert.False(Actual);
        }
    }
}
