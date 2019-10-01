using System;
using Bogus;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Server.Kestrel.Core.Internal.Http;
using Orbital.Mock.Server.Pipelines.Filters;
using Orbital.Mock.Server.Pipelines.Ports;
using System.Collections.Generic;
using Orbital.Mock.Server.Models;
using Orbital.Mock.Server.Tests.Models.Validators;
using Xunit;

namespace Orbital.Mock.Server.Tests.Pipelines.Filters
{
    public class PathValidationFilterTest
    {
        private readonly List<HttpMethod> VALIDMETHODS = new List<HttpMethod> { HttpMethod.Get, HttpMethod.Put, HttpMethod.Post, HttpMethod.Delete };

        [Fact]
        public void PathValidationFilterSuccessTest()
        {
            #region TestSetup
            var faker = new Faker();
            var input = new
            {
                Path = faker.Random.AlphaNumeric(TestUtils.GetRandomStringLength()),
                Verb = faker.PickRandom(VALIDMETHODS)
            };
            
            #endregion

            var Target = new PathValidationFilter<ProcessMessagePort>();
            var Actual = Target.Process(new ProcessMessagePort { Path = input.Path, Verb = input.Verb }).IsFaulted;

            Assert.False(Actual);

        }

        [Fact]
        public void PathValidationFilterFailTest()
        {
            #region TestSetup
            var input = new
            {
                Faults = new List<string>() { "fault" }
            };
            #endregion
            var Target = new PathValidationFilter<ProcessMessagePort>();
            var Actual = Target.Process(new ProcessMessagePort { Faults = input.Faults }).IsFaulted;

            Assert.True(Actual);

        }

        [Fact]
        public void PathValidationFilterPathNullTest()
        {
            #region TestSetup
            var faker = new Faker();
            var input = new
            {
                Verb = faker.PickRandom(VALIDMETHODS)
            };

            #endregion

            var Target = new PathValidationFilter<ProcessMessagePort>();
            var Actual = Target.Process(new ProcessMessagePort { Verb = input.Verb }).IsFaulted;

            Assert.True(Actual);
        }

        [Fact]
        public void PathValidationFilterInvalidVerbTest()
        {
            #region TestSetup
            var faker = new Faker();
            var input = new
            {
                Path = faker.Random.AlphaNumeric(TestUtils.GetRandomStringLength()),
                Verb = HttpMethod.Options
            };

            #endregion

            var Target = new PathValidationFilter<ProcessMessagePort>();
            var Actual = Target.Process(new ProcessMessagePort { Path = input.Path, Verb = input.Verb }).IsFaulted;

            Assert.True(Actual);
        }
    }
}
