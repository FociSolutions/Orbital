using Bogus;
using Orbital.Mock.Server.Models;
using Orbital.Mock.Server.Pipelines.Filters;
using Orbital.Mock.Server.Pipelines.Ports;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using Xunit;
using Assert = Xunit.Assert;

namespace Orbital.Mock.Server.Tests.Pipelines.Filters
{
    public class ResponseSelectorFilterTests
    {
        private readonly Faker<Scenario> fakerScenario;


        public ResponseSelectorFilterTests()
        {
            Randomizer.Seed = new Random(FilterTestHelpers.Seed);
            var fakerResponse = new Faker<MockResponse>()
                .CustomInstantiator(f => new MockResponse(
                    (int)f.PickRandom<HttpStatusCode>(),
                    f.Lorem.Paragraph()
                    ));
            this.fakerScenario = new Faker<Scenario>()
                .RuleFor(m => m.Id, f => f.Random.Guid().ToString())
                .RuleFor(m => m.Response, f => fakerResponse.Generate());
        }
        [Fact]
        public void ResponseSelectFilterSuccessSingleResponseTest()
        {
            #region TestSetup
            var Scenarios = fakerScenario.Generate(10);
            var ScenarioIds = Scenarios.Select(s => s.Id).ToList();

            var random = new Random(42);
            var SelectedScenarioIndex = random.Next(Scenarios.Count);
            #endregion

            List<MatchResult> rules = new List<MatchResult>();
            rules.AddRange(ScenarioIds.Select(scenario => new MatchResult(MatchResultType.Success, scenario)));

            var port = new ProcessMessagePort()
            {
                Scenarios = Scenarios,
                HeaderMatchResults = rules,
                QueryMatchResults = ScenarioIds.Take(SelectedScenarioIndex).Select(scenario => new MatchResult(MatchResultType.Success, scenario)).ToList(),
                BodyMatchResults = ScenarioIds.Take(SelectedScenarioIndex + 1).Select(scenario => new MatchResult(MatchResultType.Success, scenario)).ToList(),
            };

            var Target = new ResponseSelectorFilter<ProcessMessagePort>();

            var Actual = Target.Process(port).SelectedResponse;
            var Expected = Scenarios[0].Response;
            Assert.Equal(Expected, Actual);
        }

        [Fact]
        public void ResponseSelectFilterSuccessMultipleResponseTest()
        {
            #region TestSetup
            var Scenarios = fakerScenario.Generate(10);

            var random = new Random(42);

            var SelectedScenariosRange = random.Next(2, Scenarios.Count);
            var SelectedScenariosStartIndex = random.Next(Scenarios.Count - SelectedScenariosRange);
            var SelectedScenarios = Scenarios.Skip(SelectedScenariosStartIndex).Take(SelectedScenariosRange).ToList();
            var SelectedScenarioIndex = random.Next(Scenarios.Count);

            var PossibleResponses = SelectedScenarios.Select(s => s.Response);
            #endregion

            var port = new ProcessMessagePort()
            {
                Scenarios = Scenarios,
                HeaderMatchResults = Scenarios.Select(scenario => new MatchResult(MatchResultType.Success, scenario.Id)).ToList(),
                QueryMatchResults = Scenarios.Skip(SelectedScenarioIndex).Select(scenario => new MatchResult(MatchResultType.Success, scenario.Id)).ToList(),
                BodyMatchResults = Scenarios.Take(SelectedScenarioIndex + 1).Select(scenario => new MatchResult(MatchResultType.Success, scenario.Id)).ToList(),
            };

            var Target = new ResponseSelectorFilter<ProcessMessagePort>();

            var Actual = Target.Process(port).SelectedResponse;
            Assert.Contains(Actual, PossibleResponses);
        }

        [Fact]
        public void ResponseSelectorFilterNoResponseFoundTest()
        {
            #region TestSetup
            var Scenarios =  new List<Scenario>();
            #endregion

            var port = new ProcessMessagePort()
            {
                Scenarios = Scenarios,
            };

            var Target = new ResponseSelectorFilter<ProcessMessagePort>();

            var Actual = Target.Process(port).SelectedResponse;
            var Expected = new MockResponse();

            Assert.Equal(Expected, Actual);
        }

        [Fact]
        public void ResponseSelectorFilterFaultedTest()
        {
            var port = new ProcessMessagePort()
            {
                Faults = new List<string> { "fault" }
            };

            var Target = new ResponseSelectorFilter<ProcessMessagePort>();

            var Actual = Target.Process(port).SelectedResponse;

            Assert.Null(Actual);
        }
    }

}
