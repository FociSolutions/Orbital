using Orbital.Mock.Server.Models;
using Swashbuckle.AspNetCore.Filters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Orbital.Mock.Server.Pipelines.Models.Examples
{
    public class MockDefinitionsModelExamples : IExamplesProvider<MockDefinition>
    {
        public MockDefinition GetExamples()
        {
            return new MockDefinition {
                Host = "petstore.swagger.io",
                BasePath = "/api",
                Metadata = {
                Title = "Test Title",
                Description = "Test Description"}
            };
        }
    }
}
