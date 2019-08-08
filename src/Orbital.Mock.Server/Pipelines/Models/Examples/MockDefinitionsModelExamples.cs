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
            List<Scenario> scenarios = new List<Scenario>();
            scenarios.Add(new Scenario() {Id ="id01", Metadata = new MetadataInfo{Title = "Scenario 1", Description = "Test Scenario 1" },
                Verb = "", Path = "", Response = new MockResponse(), RequestMatchRules = new RequestMatchRules()  });
            scenarios.Add(new Scenario()
            {
                Id = "id02",
                Metadata = new MetadataInfo { Title = "Scenario 2", Description = "Test Scenario 2" },
                Verb = "",
                Path = "",
                Response = new MockResponse { Status = 200, Body = "", Headers = null },
                RequestMatchRules = new RequestMatchRules()
            });
            scenarios.Add(new Scenario()
            {
                Id = "id03",
                Metadata = new MetadataInfo { Title = "Scenario 3", Description = "Test Scenario 3" },
                Verb = "",
                Path = "",
                Response = new MockResponse { Status = 200, Body = "", Headers = null },
                RequestMatchRules = new RequestMatchRules {HeaderRules = null, BodyRules = "", QueryRules = null }
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
