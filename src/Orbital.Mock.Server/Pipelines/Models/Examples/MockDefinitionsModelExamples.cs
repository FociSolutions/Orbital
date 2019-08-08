using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi.Models;
using Newtonsoft.Json;
using Orbital.Mock.Server.Models;
using Orbital.Mock.Server.Registrations;
using Swashbuckle.AspNetCore.Filters;
using Swashbuckle.AspNetCore.Swagger;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace Orbital.Mock.Server.Pipelines.Models.Examples
{
    public class MockDefinitionsModelExamples : IExamplesProvider<MockDefinition>
    {
        private object services;


        public MockDefinition GetExamples()
        {
            IDictionary<string, string> headers = new Dictionary<string, string>();
            IDictionary<string, string> headersRules = new Dictionary<string, string>();
            IDictionary<string, string> queryRules = new Dictionary<string, string>();
            string bodyRules = "bodyRule";

            for (int i = 0; i < 3; i++)
            {
                headers.Add("header" + i, "string");
                headersRules.Add("headerRule" + i, "string");
                queryRules.Add("queryRule" + i, "string");
            }

            List<Scenario> scenarios = new List<Scenario>();
            scenarios.Add(new Scenario() {Id ="id01", Metadata = new MetadataInfo{Title = "Scenario 1", Description = "Test Scenario 1" },
                Verb = "GET", Path = "/pets", Response = new MockResponse { Status = 0, Body = "Scenario 1", Headers = headers },
                RequestMatchRules = new RequestMatchRules {HeaderRules = headersRules, QueryRules = queryRules, BodyRules = bodyRules }
            });
            scenarios.Add(new Scenario()
            {
                Id = "id02",
                Metadata = new MetadataInfo { Title = "Scenario 2", Description = "Test Scenario 2" },
                Verb = "GET",
                Path = "/pets",
                Response = new MockResponse { Status = 200, Body = "Testing scenario 2", Headers = headers },
                RequestMatchRules = new RequestMatchRules { HeaderRules = headersRules, QueryRules = queryRules, BodyRules = bodyRules }
            });
            scenarios.Add(new Scenario()
            {
                Id = "id03",
                Metadata = new MetadataInfo { Title = "Scenario 3", Description = "Test Scenario 3" },
                Verb = "GET",
                Path = "/pets",
                Response = new MockResponse { Status = 200, Body = "Scenario 3", Headers = headers },
                RequestMatchRules = new RequestMatchRules { HeaderRules = headersRules, QueryRules = queryRules, BodyRules = bodyRules }
            });


            return new MockDefinition
            {
                Host = "petstore.swagger.io",
                BasePath = "/api",
                Metadata = new MetadataInfo
                {
                    Title = "Test Title",
                    Description = "Test Description"
                },
                OpenApi = new OpenApiDocument(),
                Scenarios = scenarios
            };
        }
    }
}
