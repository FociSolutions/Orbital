using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi.Models;
using Newtonsoft.Json;
using Orbital.Mock.Server.Models;
using Orbital.Mock.Server.Registrations;
using Swashbuckle.AspNetCore.Filters;
using Swashbuckle.AspNetCore.Swagger;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace Orbital.Mock.Server.Pipelines.Models.Examples
{
    public class MockDefinitionsModelExamples : IExamplesProvider<MockDefinition>
    {
        /// <summary>
        /// Created a json example to show when the server is fired up.
        /// </summary>
        /// <returns>A MockDefinition with different scenarios</returns>
        public MockDefinition GetExamples()
        {
            
            DateTime dateTime = new DateTime();
            IDictionary<string, string> headers1 = new Dictionary<string, string>();
            IDictionary<string, string> headers2 = new Dictionary<string, string>();
            IDictionary<string, string> headers3 = new Dictionary<string, string>();
            IDictionary<string, string> headersRule1 = new Dictionary<string, string>();
            IDictionary<string, string> headersRule2 = new Dictionary<string, string>();
            IDictionary<string, string> headersRule3 = new Dictionary<string, string>();
            IDictionary<string, string> queryRules1 = new Dictionary<string, string>();
            IDictionary<string, string> queryRules2 = new Dictionary<string, string>();
            IDictionary<string, string> queryRules3 = new Dictionary<string, string>();

            ICollection<BodyRule> bodyRules1 = new List<BodyRule>();
            ICollection<BodyRule> bodyRules2 = new List<BodyRule>();
            ICollection<BodyRule> bodyRules3 = new List<BodyRule>();

            bodyRules1.Add(new BodyRule { Rule = "Use Json Schema", Type = BodyRuleTypes.JsonSchema});
            bodyRules2.Add(new BodyRule { Rule = "Use Json Path", Type = BodyRuleTypes.JsonPath});
            bodyRules3.Add(new BodyRule { Rule = "Use Body Equality", Type = BodyRuleTypes.BodyEquality});

            headers1.Add("Date", dateTime.ToString());
            headers2.Add("Expires", "Tue, 22 Jan 2020 18:56:00 GMT");
            headers3.Add("Cache-Control: public", "max-age=6000");
            headersRule1.Add("Range", "bytes=0-1999");
            headersRule2.Add("Content-Type", "application/json");
            headersRule3.Add("Content-Length", "216513521");
            queryRules1.Add("key", "http://petstore.swagger.io/v2/documents:analyzeEntities?Key=API_KEY");
            queryRules2.Add("alt", "json");
            queryRules3.Add("prettyPrint", "true");


            List<Scenario> scenarios = new List<Scenario>();
            scenarios.Add(new Scenario() {Id ="id01", Metadata = new MetadataInfo{Title = "Scenario 1", Description = "Test Scenario 1" },
                Verb = 0, Path = "/pets", Response = new MockResponse { Status = 0, Body = "Scenario 1", Headers = headers1 },
                RequestMatchRules = new RequestMatchRules {HeaderRules = headersRule1, QueryRules = queryRules1, BodyRules = bodyRules1 }
            });
            scenarios.Add(new Scenario()
            {
                Id = "id02",
                Metadata = new MetadataInfo { Title = "Scenario 2", Description = "Test Scenario 2" },
                Verb = 0,
                Path = "/pets",
                Response = new MockResponse { Status = 200, Body = "Testing scenario 2", Headers = headers2 },
                RequestMatchRules = new RequestMatchRules { HeaderRules = headersRule2, QueryRules = queryRules2, BodyRules = bodyRules2 }
            });
            scenarios.Add(new Scenario()
            {
                Id = "id03",
                Metadata = new MetadataInfo { Title = "Scenario 3", Description = "Test Scenario 3" },
                Verb = 0,
                Path = "/pets",
                Response = new MockResponse { Status = 200, Body = "Scenario 3", Headers = headers3 },
                RequestMatchRules = new RequestMatchRules { HeaderRules = headersRule3, QueryRules = queryRules3, BodyRules = bodyRules3 }
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
