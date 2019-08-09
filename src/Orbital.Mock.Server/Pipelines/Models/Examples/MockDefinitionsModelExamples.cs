using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi.Models;
using Newtonsoft.Json;
using Orbital.Mock.Server.Models;
using Orbital.Mock.Server.Registrations;
using Swashbuckle.AspNetCore.Filters;
using Swashbuckle.AspNetCore.Swagger;
using System;
using System.Collections;
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

            //Using arrays
            IDictionary<string, string>[] headers = new Dictionary<string, string>[] 
            {
                new Dictionary<string, string>(),
                new Dictionary<string, string>(),
                new Dictionary<string, string>()
            };

            IDictionary<string, string>[] headersRules = new Dictionary<string, string>[] 
            {
                new Dictionary<string, string>(),
                new Dictionary<string, string>(),
                new Dictionary<string, string>()
            };

            IDictionary<string, string>[] queryRules = new Dictionary<string, string>[]
            {
                new Dictionary<string, string>(),
                new Dictionary<string, string>(),
                new Dictionary<string, string>()
            };

            ICollection<BodyRule>[] bodyRules = new List<BodyRule>[] 
            {
                new List<BodyRule>(),
                new List<BodyRule>(),
                new List<BodyRule>()
        };


            for (int i = 0; i < 2; i++)
            {
                headers[i].Add("Date", dateTime.ToString());
                headers[i].Add("Expires", "Tue, 22 Jan 2020 18:56:00 GMT");
                headers[i].Add("Cache-Control: public", "max-age=6000");

                headersRules[i].Add("Range", "bytes=0-1999");
                headersRules[i].Add("Content-Type", "application/json");
                headersRules[i].Add("Content-Length", "216513521");

                queryRules[i].Add("key", "http://petstore.swagger.io/v2/documents:analyzeEntities?Key=API_KEY");
                queryRules[i].Add("alt", "json");
                queryRules[i].Add("prettyPrint", "true");

                bodyRules[i].Add(new BodyRule { Rule = "Use Json Schema", Type = BodyRuleTypes.JsonSchema });
                bodyRules[i].Add(new BodyRule { Rule = "Use Json Path", Type = BodyRuleTypes.JsonPath });
                bodyRules[i].Add(new BodyRule { Rule = "Use Body Equality", Type = BodyRuleTypes.BodyEquality });
            }


            List<Scenario> scenarios = new List<Scenario>();
            scenarios.Add(new Scenario() {Id ="id01", Metadata = new MetadataInfo{Title = "Scenario 1", Description = "Test Scenario 1" },
                Verb = 0, Path = "/pets", Response = new MockResponse { Status = 0, Body = "Scenario 1", Headers = headers[0] },
                RequestMatchRules = new RequestMatchRules {HeaderRules = headersRules[0], QueryRules = queryRules[0], BodyRules = bodyRules[0] }
            });
            scenarios.Add(new Scenario()
            {
                Id = "id02",
                Metadata = new MetadataInfo { Title = "Scenario 2", Description = "Test Scenario 2" },
                Verb = 0,
                Path = "/pets",
                Response = new MockResponse { Status = 200, Body = "Testing scenario 2", Headers = headers[1] },
                RequestMatchRules = new RequestMatchRules { HeaderRules = headersRules[1], QueryRules = queryRules[1], BodyRules = bodyRules[1] }
            });
            scenarios.Add(new Scenario()
            {
                Id = "id03",
                Metadata = new MetadataInfo { Title = "Scenario 3", Description = "Test Scenario 3" },
                Verb = 0,
                Path = "/pets",
                Response = new MockResponse { Status = 200, Body = "Scenario 3", Headers = headers[2] },
                RequestMatchRules = new RequestMatchRules { HeaderRules = headersRules[2], QueryRules = queryRules[2], BodyRules = bodyRules[0] }
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
