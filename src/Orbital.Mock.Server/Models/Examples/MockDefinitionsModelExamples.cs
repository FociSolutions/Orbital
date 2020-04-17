using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Orbital.Mock.Server.Models;
using Swashbuckle.AspNetCore.Filters;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.IO;
using Microsoft.AspNetCore.Http;
using Orbital.Mock.Server.Models.Rules;
using Orbital.Mock.Server.Models.Interfaces;
using System.Linq;

namespace Orbital.Mock.Server.Pipelines.Models.Examples
{
    [ExcludeFromCodeCoverage]
    public class MockDefinitionsModelExamples : IExamplesProvider
    {
        /// <summary>
        /// Created a json example to show when the server is fired up.
        /// </summary>
        /// <returns>A MockDefinition with different scenarios</returns>
        public object GetExamples()
        {
            DateTime dateTime = new DateTime();
            List<Scenario> scenarios = new List<Scenario>();

            IDictionary<string, string>[] headers = new Dictionary<string, string>[]
            {
                new Dictionary<string, string>(),
                new Dictionary<string, string>(),
                new Dictionary<string, string>()
            };

            var urlRules = new List<KeyValuePair<string, string>>();

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


            urlRules.Add(new KeyValuePair<string, string>("url", "pets"));
            urlRules.Add(new KeyValuePair<string, string>("url", "pet"));
            urlRules.Add(new KeyValuePair<string, string>("url", "p"));

            for (int i = 0; i < 3; i++)
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

                bodyRules[i].Add(new BodyRule(ComparerType.JSONCONTAINS, JObject.FromObject(new { ruleType = "Use Body Contains" })));
                bodyRules[i].Add(new BodyRule(ComparerType.JSONEQUALITY, JObject.FromObject(new { ruleType = "Use Body Equality" })));
            }

            scenarios.Add(new Scenario()
            {
                Id = "id01",
                Metadata = new MetadataInfo { Title = "Scenario 1", Description = "Test Scenario 1" },
                Verb = 0,
                Path = "/pets",
                Response = new MockResponse { Status = 0, Body = "Scenario 1", Headers = headers[0], Type = ResponseType.CUSTOM },
                RequestMatchRules = new RequestMatchRules { HeaderRules = new List<KeyValuePairRule>() { new KeyValuePairRule() { Type = ComparerType.TEXTCONTAINS, RuleValue = new KeyValuePair<string, string>(headers[0].Keys.ToList().First(), headers[0].Values.ToList().First()) } },
                    QueryRules = new List<KeyValuePairRule>() { new KeyValuePairRule() { Type = ComparerType.TEXTCONTAINS, RuleValue = new KeyValuePair<string, string>(queryRules[0].Keys.ToList().First(), queryRules[0].Values.ToList().First())} }, 
                                                            BodyRules = bodyRules[0] }
            });
            scenarios.Add(new Scenario()
            {
                Id = "id02",
                Metadata = new MetadataInfo { Title = "Scenario 2", Description = "Test Scenario 2" },
                Verb = 0,
                Path = "/pets",
                Response = new MockResponse { Status = StatusCodes.Status200OK, Body = "Testing scenario 2", Headers = headers[1], Type = ResponseType.CUSTOM },
                RequestMatchRules = new RequestMatchRules {
                    UrlRules = new List<KeyValuePairRule>() { new KeyValuePairRule() { Type = ComparerType.TEXTCONTAINS, RuleValue = new KeyValuePair<string, string>(headersRules[1].Keys.ToList().First(), headersRules[1].Values.ToList().First()) } },
                    HeaderRules = new List<KeyValuePairRule>() { new KeyValuePairRule() { Type = ComparerType.TEXTCONTAINS, RuleValue = new KeyValuePair<string, string>(headersRules[1].Keys.ToList().First(), headersRules[1].Values.ToList().First()) } },
                    QueryRules = new List<KeyValuePairRule>() { new KeyValuePairRule() { Type = ComparerType.TEXTCONTAINS, RuleValue = new KeyValuePair<string, string>(queryRules[1].Keys.ToList().First(), queryRules[1].Values.ToList().First()) } },
                    BodyRules = bodyRules[1] }
            });
            scenarios.Add(new Scenario()
            {
                Id = "id03",
                Metadata = new MetadataInfo { Title = "Scenario 3", Description = "Test Scenario 3" },
                Verb = 0,
                Path = "/pets",
                Response = new MockResponse { Status = StatusCodes.Status200OK, Body = "Scenario 3", Headers = headers[2], Type = ResponseType.CUSTOM },
                RequestMatchRules = new RequestMatchRules {
                    HeaderRules = new List<KeyValuePairRule>() { new KeyValuePairRule(){ Type = ComparerType.TEXTCONTAINS, RuleValue = new KeyValuePair<string, string>(headersRules[2].Keys.ToList().First(), headersRules[2].Values.ToList().First()) } },
                    QueryRules = new List<KeyValuePairRule>() { new KeyValuePairRule() { Type = ComparerType.TEXTCONTAINS, RuleValue = new KeyValuePair<string, string>(queryRules[2].Keys.ToList().First(), queryRules[2].Values.ToList().First()) } },
                    BodyRules = bodyRules[2] }
            });

            return new
            {
                Host = "petstore.swagger.io",
                BasePath = "/api",
                Metadata = new MetadataInfo
                {
                    Title = "Test Title",
                    Description = "Test Description"
                },
                OpenApi = JsonConvert.DeserializeObject(File.ReadAllText(Path.Combine(@"Models", "Examples", "SwaggerSchemaExamples", "OpenApiDocumentSwaggerSchemaExample.json"))),
                Scenarios = scenarios
            };
        }
    }
}
