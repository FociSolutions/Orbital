using Bogus;
using Orbital.Mock.Server.Models;
using Orbital.Mock.Server.Pipelines.Filters;
using Orbital.Mock.Server.Pipelines.Ports;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using Xunit;

namespace Orbital.Mock.Server.Tests.Pipelines.Filters
{
    public class ResponseSelectorFilterTests
    {
        private readonly Faker<Scenario> fakerScenario;


        public ResponseSelectorFilterTests()
        {
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

            var random = new Random();
            var SelectedScenarioIndex = random.Next(Scenarios.Count);
            #endregion

            var port = new ProcessMessagePort()
            {
                Scenarios = Scenarios,
                HeaderMatchResults = ScenarioIds,
                QueryMatchResults = ScenarioIds.Take(SelectedScenarioIndex + 1).ToList(),
                BodyMatch = ScenarioIds.Skip(SelectedScenarioIndex).Take(ScenarioIds.Count - SelectedScenarioIndex).ToList()
            };

            var Target = new ResponseSelectorFilter<ProcessMessagePort>();

            var Actual = Target.Process(port).SelectedResponse;
            var Expected = Scenarios[SelectedScenarioIndex].Response;
            Assert.Equal(Expected, Actual);
        }

        [Fact]
        public void ResponseSelectFilterSuccessMultipleResponseTest()
        {
            #region TestSetup
            var Scenarios = fakerScenario.Generate(10);

            var random = new Random();

            var SelectedScenariosRange = random.Next(2, Scenarios.Count);
            var SelectedScenariosStartIndex = random.Next(Scenarios.Count - SelectedScenariosRange);
            var SelectedScenarios = Scenarios.Skip(SelectedScenariosStartIndex).Take(SelectedScenariosRange).ToList();

            var PossibleResponses = SelectedScenarios.Select(s => s.Response);
            #endregion

            var port = new ProcessMessagePort()
            {
                Scenarios = Scenarios,
                HeaderMatchResults = Scenarios.Select(s => s.Id).ToList(),
                QueryMatchResults = SelectedScenarios.Select(s => s.Id).ToList(),
                BodyMatch = SelectedScenarios.Select(s => s.Id).ToList()
            };

            var Target = new ResponseSelectorFilter<ProcessMessagePort>();

            var Actual = Target.Process(port).SelectedResponse;
            Assert.Contains(Actual, PossibleResponses);
        }

        [Fact]
        public void ResponseSelectorFilterNoResponseFoundTest()
        {
            #region TestSetup
            var Scenarios = fakerScenario.Generate(10);
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
