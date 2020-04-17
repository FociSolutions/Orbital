using System;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Orbital.Mock.Server.Models;
using Orbital.Mock.Server.Pipelines.Filters.Bases;
using Orbital.Mock.Server.Pipelines.Ports.Interfaces;
using Scriban;
using Scriban.Runtime;

namespace Orbital.Mock.Server.Pipelines.Filters
{
    public class ResponseSelectorFilter<T> : FaultableBaseFilter<T>
        where T : IFaultablePort, IScenariosPort, IQueryMatchPort, IBodyMatchPort, IHeaderMatchPort, IResponseSelectorPort, IPathValidationPort, IUrlMatchPort, IPolicyPort
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

            var bestScenarios = port.HeaderMatchResults
                .Concat(port.BodyMatchResults)
                .Concat(port.QueryMatchResults)
                .Concat(port.URLMatchResults)
                .GroupBy(scenario => scenario.ScenarioId)
                .Where(scenarioGrouping =>
                    !scenarioGrouping.Select(scenarioGroup => scenarioGroup.Match)
                        .Contains(MatchResultType.Fail))
                .Select(match => new
                {
                    ScenarioId = match.Key,
                    Score = match.Where(x => x.Match.Equals(MatchResultType.Success)).Sum(x => (int)x.Match),
                    DefaultScenario = match.Select(x => x.DefaultScenario).First()
                })
                .OrderByDescending(match => match.Score)
                .ToList();

            // if there are no default scenarios, then choose the first scenario as the best
            var bestScenario = bestScenarios.Where(scenario => scenario.Score == bestScenarios.FirstOrDefault().Score)
                                            .Where(scenario => scenario.DefaultScenario)
                                            .FirstOrDefault() ?? bestScenarios.FirstOrDefault();

            if (port.Scenarios.Any())
            {
                port.Policies = (bestScenario == null
                    ? port.Scenarios.First().Policies
                    : port.Scenarios.First(scenario => scenario.Id.Equals(bestScenario.ScenarioId)).Policies) ?? new List<Policy>();
            }

            port.SelectedResponse = bestScenario != null ? port.Scenarios.First(scenario => scenario.Id.Equals(bestScenario.ScenarioId)).Response
                : port.Scenarios.Count() > 0 ? port.Scenarios.First().Response : new MockResponse();

            if(port.SelectedResponse.Type == ResponseType.TEMPLATED)
            {
                var request = new ScriptObject();
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
                    port.SelectedResponse.Body = template.Render(templateContext);

                }
                // if the template rendering fails, the exception type is null but the error message is non-empty
                catch (Exception e) when (e is InvalidOperationException || e is ArgumentNullException || e.Source.Equals("Scriban"))
                {
                    port.SelectedResponse = new MockResponse();
                }
            }

            return port;
        }
    }
}
