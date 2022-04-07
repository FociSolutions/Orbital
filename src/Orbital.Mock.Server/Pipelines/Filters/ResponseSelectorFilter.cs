using System;
using System.Net;
using System.Linq;
using System.Collections.Generic;

using Orbital.Mock.Definition.Match;
using Orbital.Mock.Definition.Policies;
using Orbital.Mock.Definition.Response;

using Orbital.Mock.Server.Pipelines.Ports;
using Orbital.Mock.Server.Pipelines.Filters.Bases;

using Scriban;
using Scriban.Runtime;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Orbital.Mock.Server.Pipelines.Filters
{
    class ScenarioResultScore
    {
        public string ScenarioId { get; set; } = null;
        public int Score { get; set; } = 0;
        public bool DefaultScenario { get; set; } = false;
    }

    public class ResponseSelectorFilter<T> : FaultableBaseFilter<T>
        where T : IProcessMessagePort
    {
        private readonly TemplateContext templateContext;
        public ResponseSelectorFilter(TemplateContext templateContext)
        {
            this.templateContext = templateContext;
        }
        /// <summary>
        /// Selects the response to use based on the match results from the previous filters. Ties are broken randomly.
        /// </summary>
        /// <param name="port">The port containing necessary data</param>
        /// <returns>Port containing processed data</returns>
        public override T Process(T port)
        {
            if (!IsPipelineValid(ref port, GetType())) return port;

            if (port.CheckAuthentication && AuthenticationFailure(port, out MockResponse failResponse))
            {
                port.SelectedResponse = failResponse;
                return port;
            }

            var bestScenarios = GetBestScenarios(port);

            // if there are no default scenarios, then choose the first scenario as the best
            var bestScenario = GetBestOrDefault(bestScenarios);

            // if all scenarios do not match and there is a default scenario (which also doesn't match), use the default scenario
            if (bestScenario == null && port.Scenarios.Any(scenario => scenario.DefaultScenario))
            {
                bestScenario = GetDefaultScenario(port);
            }

            if (port.Scenarios.Any())
            {
                port.Policies = (bestScenario == null
                    ? port.Scenarios.First().Policies
                    : port.Scenarios.First(scenario => scenario.Id.Equals(bestScenario.ScenarioId)).Policies) ?? new List<Policy>();
            }

            port.SelectedResponse = bestScenario != null ? port.Scenarios.First(scenario => scenario.Id.Equals(bestScenario.ScenarioId)).Response
                : port.Scenarios.Count() > 0 ? port.Scenarios.First().Response : new MockResponse();

            if (port.SelectedResponse.Type == MockResponseType.TEMPLATED) { port.SelectedResponse = GetTemplatedResponse(port); }

            return port;
        }

        private MockResponse GetTemplatedResponse(T port)
        {
            var request = new ScriptObject();
            var response = new MockResponse();
            try
            {
                var requestObject = JObject.Parse(port.Body);
                request.Add("request", requestObject);
                templateContext.PushGlobal(request);
            }
            catch (JsonReaderException)
            {
                // can ignore because response does not have to be valid JSON
                // request.* globals cannot be defined as they are bound to the JSON
                // incoming response
            }

            try
            {
                var template = Template.Parse(port.SelectedResponse.Body);
                response.Body = template.Render(templateContext);
            }
            // if the template rendering fails, the exception type is null but the error message is non-empty
            catch (Exception e) when (e is InvalidOperationException || e is ArgumentNullException || e.Source.Equals("Scriban"))
            {
                response = new MockResponse();
            }

            return response;
        }

        static bool AuthenticationFailure(IProcessMessagePort port, out MockResponse response)
        {
            //< If authentication was successful - pass through
            if (port.IsAuthenticated)
            {
                response = null;
                return false;
            }

            var res = port.TokenValidationResults
                            .Concat(port.TokenMatchResults)
                            .Select(x => x.ScenarioId)
                            .ToHashSet();
            //< Get the scenarios (for those IDs) that contained a 401 (unauthorized) response
            var scenarios = port.Scenarios.Where(x => res.Contains(x.Id) && x.Response.Status == (int)HttpStatusCode.Unauthorized);
            response = scenarios.Count() > 0 ? scenarios.First().Response : MockResponse.Create401();  

            return true;
        }

        static IEnumerable<ScenarioResultScore> GetBestScenarios(IProcessMessagePort port)
        {
            return port.HeaderMatchResults
                       .Concat(port.BodyMatchResults)
                       .Concat(port.QueryMatchResults)
                       .Concat(port.URLMatchResults)
                       .Concat(port.TokenMatchResults)
                       .GroupBy(result => result.ScenarioId)
                       .Where(scenarioGrouping =>
                           !scenarioGrouping.Select(scenarioGroup => scenarioGroup.Match)
                                            .Contains(MatchResultType.Fail))
                       .Select(match => new ScenarioResultScore
                       {
                           ScenarioId = match.Key,
                           Score = match.Where(x => x.Match.Equals(MatchResultType.Success)).Sum(x => (int)x.Match),
                           DefaultScenario = match.Select(x => x.DefaultScenario).First()
                       })
                       .OrderByDescending(match => match.Score)
                       .ToList();
        }

        static ScenarioResultScore GetBestOrDefault(IEnumerable<ScenarioResultScore> bestScenarios)
        {
            return bestScenarios.Where(scenario => scenario.Score == bestScenarios.FirstOrDefault().Score)
                                .Where(scenario => scenario.DefaultScenario)
                                .FirstOrDefault() ?? bestScenarios.FirstOrDefault();
        }

        static ScenarioResultScore GetDefaultScenario(IProcessMessagePort port)
        {
            return port.Scenarios.Where(scenario => scenario.DefaultScenario)
                                 .Select(match => new ScenarioResultScore
                                 {
                                     ScenarioId = match.Id,
                                     Score = 0,
                                     DefaultScenario = match.DefaultScenario
                                 }).FirstOrDefault();
        }
    }
}
