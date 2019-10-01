using System;
using System.Net.Http;
using System.Threading.Tasks;
using LightBDD.Core.Execution;
using LightBDD.Core.Extensibility.Execution;
using Newtonsoft.Json.Linq;
using Orbital.Mock.Server.IntegrationTests;

namespace Orbital.Mock.IntegrationTests
{
    /// <summary>
    /// The ClearServerScenarioDecorator is a decorator applied to a scenario that
    /// deletes all mock definitions from the server before the scenario executes. This
    /// is to avoid pollution of the server state between scenarios.
    /// </summary>
    internal class ClearServerScenarioDecorator : Attribute, IScenarioDecorator
    {
        public Task ExecuteAsync(IScenario scenario, Func<Task> scenarioInvocation)
        {
            var client = new HttpClient();
            var response = client.GetAsync(CommonData.AdminUri).Result;
            var content = response.Content.ReadAsStringAsync().Result;
            try
            {
                var mockDefinitionTokens = JArray.Parse(content);
                foreach (var mockDefinitionToken in mockDefinitionTokens)
                {
                    var mockId = mockDefinitionToken.SelectToken("metadata.title").ToString();
                    client.DeleteAsync($"{CommonData.AdminUri}/{mockId}").Wait();
                }
            }
            catch (Exception e)
            {
                throw new ScenarioExecutionException(e);
            }

            return scenarioInvocation();
        }
    }
}