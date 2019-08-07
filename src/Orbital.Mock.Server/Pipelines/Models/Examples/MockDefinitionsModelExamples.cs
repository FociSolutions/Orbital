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
                Scenarios = new List<Scenario>()

            };
        }
    }
}
