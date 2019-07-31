using Bogus;
using Microsoft.AspNetCore.Http;
using Orbital.Mock.Server.Pipelines.Filters;
using Orbital.Mock.Server.Pipelines.Ports;
using System.Collections.Generic;
using Xunit;

namespace Orbital.Mock.Server.Tests.Pipelines.Filters
{
    public class PathValidationFilterTest
    {
        private readonly List<string> VALIDMETHODS = new List<string> { HttpMethods.Get, HttpMethods.Put, HttpMethods.Post, HttpMethods.Delete };

        [Fact]
        public void PathValidationFilterSuccessTest()
        {
            #region TestSetup
            var faker = new Faker();
            var input = new
            {
                Path = faker.Random.String(),
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
            var Actual = Target.Process(new ProcessMessagePort {Faults = input.Faults }).IsFaulted;

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
        public void PathValidationFilterVerbCheckCaseIndependenceTest()
        {
            #region TestSetup
            var faker = new Faker();
            var input = new
            {
                Path = faker.Random.String(),
                Verb = faker.PickRandom(VALIDMETHODS).ToLower()
            };

            #endregion

            var Target = new PathValidationFilter<ProcessMessagePort>();
            var Actual = Target.Process(new ProcessMessagePort { Path = input.Path, Verb = input.Verb }).IsFaulted;

            Assert.False(Actual);
        }

        [Fact]
        public void PathValidationFilterInvalidVerbTest()
        {
            #region TestSetup
            var faker = new Faker();
            var input = new
            {
                Path = faker.Random.String(),
                Verb = faker.PickRandom(VALIDMETHODS).ToLower() + "invalid"
            };

            #endregion

            var Target = new PathValidationFilter<ProcessMessagePort>();
            var Actual = Target.Process(new ProcessMessagePort { Path = input.Path, Verb = input.Verb }).IsFaulted;

            Assert.True(Actual);
        }

        [Fact]
        public void PathValidationFilterNullVerbTest()
        {
            #region TestSetup
            var faker = new Faker();
            var input = new
            {
                Path = faker.Random.String(),
            };
            #endregion

            var Target = new PathValidationFilter<ProcessMessagePort>();
            var Actual = Target.Process(new ProcessMessagePort {Path = input.Path }).IsFaulted;

            Assert.True(Actual);
        }
    }
}
