using Bogus;
using Orbital.Mock.Server.Models;
using Orbital.Mock.Server.Models.Validators;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xunit;
using Assert = Xunit.Assert;

namespace Orbital.Mock.Server.Tests.Models
{
    public class TokenValidationInfoTests
    {
        private Faker<TokenValidationInfo> tokenValidationInfoFake;
        private TokenValidationValidator validator = new TokenValidationValidator();

        public TokenValidationInfoTests()
        {
            this.tokenValidationInfoFake = tokenValidationInfoFake = new Faker<TokenValidationInfo>()
                .RuleFor(m => m.Validate, f => true)
                .RuleFor(m => m.Key, f => Guid.NewGuid().ToString());
        }

        [Fact]
        public void EqualsSuccessTest()
        {
            #region Test Setup
            var tokenValidationInfo = tokenValidationInfoFake.Generate();

            var input = new
            {
                objTest = tokenValidationInfo as Object
            };

            #endregion

            var Actual = tokenValidationInfo.Equals(input.objTest);
            Assert.True(Actual);
        }


        [Fact]
        public void EqualsFailsNullTokenValidationTest()
        {
            #region Test Setup
            var tokenValidationInfo = tokenValidationInfoFake.Generate();
            #endregion

            var Actual = tokenValidationInfo.Equals(null);
            Assert.False(Actual);
        }

        [Fact]
        public void EqualsFailsTitleTest()
        {
            #region Test Setup
            var tokenValidationInfo = tokenValidationInfoFake.Generate();

            var input = new
            {
                tokenValidationInfoTest = new TokenValidationInfo
                {
                    Validate = false,
                    Key = tokenValidationInfo.Key
                }
            };

            #endregion

            var Actual = tokenValidationInfo.Equals(input.tokenValidationInfoTest);
            Xunit.Assert.False(Actual);
        }

        [Fact]
        public void EqualsFailsDescriptionTest()
        {
            #region Test Setup
            var tokenValidationInfo = tokenValidationInfoFake.Generate();

            var input = new
            {
                tokenValidationInfoTest = new TokenValidationInfo
                {
                    Validate = tokenValidationInfo.Validate,
                    Key = Guid.NewGuid().ToString()
                }
            };

            #endregion

            var Actual = tokenValidationInfo.Equals(input.tokenValidationInfoTest);
            Assert.False(Actual);
        }

        [Fact]
        public void WhitespaceRegexText()
        {
            #region Test Setup
            var tokenValidationInfoTest = new TokenValidationInfo
            {
                Validate = true,
                Key = "test test"
            };
            #endregion

            var result = validator.Validate(tokenValidationInfoTest);
            Assert.False(result.IsValid);

            tokenValidationInfoTest.Key = Guid.NewGuid().ToString();
            result = validator.Validate(tokenValidationInfoTest);
            Assert.True(result.IsValid);
        }
    }
}