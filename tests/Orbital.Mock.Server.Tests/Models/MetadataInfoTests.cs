using Bogus;
using Orbital.Mock.Server.Models;
using System;
using System.Collections.Generic;
using System.Text;
using Xunit;

namespace Orbital.Mock.Server.Tests.Models
{
    public class MetadataInfoTests
    {
        private Faker<MetadataInfo> metadataInfoFake;

        public MetadataInfoTests()
        {
            this.metadataInfoFake = metadataInfoFake = new Faker<MetadataInfo>()
                .RuleFor(m => m.Description, f => f.Lorem.Paragraph())
                .RuleFor(m => m.Title, f => f.Lorem.Sentence());
        }

        [Fact]
        public void EqualsSuccessTest()
        {
            #region Test Setup
            var metadataInfo = metadataInfoFake.Generate();

            var input = new
            {
                objTest = metadataInfo as Object
            };

            #endregion

            var Actual = metadataInfo.Equals(input.objTest);
            Assert.True(Actual);
        }


        [Fact]
        public void EqualsFailsNullMetadataTest()
        {
            #region Test Setup
            var metadataInfo = metadataInfoFake.Generate();
            #endregion

            var Actual = metadataInfo.Equals(null);
            Assert.False(Actual);
        }

        [Fact]
        public void EqualsFailsTitleTest()
        {
            #region Test Setup
            var metadataInfo = metadataInfoFake.Generate();

            var input = new
            {
                metadataInfoTest = new MetadataInfo
                {
                    Title = "",
                    Description = metadataInfo.Description
                }
            };

            #endregion

            var Actual = metadataInfo.Equals(input.metadataInfoTest);
            Assert.False(Actual);
        }

        [Fact]
        public void EqualsFailsDescriptionTest()
        {
            #region Test Setup
            var metadataInfo = metadataInfoFake.Generate();

            var input = new
            {
                metadataInfoTest = new MetadataInfo
                {
                    Title = metadataInfo.Title,
                    Description = ""
                }
            };

            #endregion

            var Actual = metadataInfo.Equals(input.metadataInfoTest);
            Assert.False(Actual);
        }
    }
}
