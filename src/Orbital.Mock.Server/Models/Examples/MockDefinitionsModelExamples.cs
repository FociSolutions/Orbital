﻿using System;
using System.IO;
using System.Linq;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

using Microsoft.AspNetCore.Http;

using Orbital.Mock.Definition;
using Orbital.Mock.Definition.Rules;
using Orbital.Mock.Definition.Response;

using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

using Swashbuckle.AspNetCore.Filters;

namespace Orbital.Mock.Server.Pipelines.Models.Examples
{
    [ExcludeFromCodeCoverage]
    public class MockDefinitionsModelExamples : IExamplesProvider<object>
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

            var urlRules = new List<string>();

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

            urlRules.Add(@"url/pets");
            urlRules.Add(@"url/pet");
            urlRules.Add(@"url/p");

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
                Response = new MockResponse { Status = 0, Body = "Scenario 1", Headers = headers[0], Type = MockResponseType.CUSTOM },
                RequestMatchRules = new RequestMatchRules {
                    HeaderRules = new List<KeyValueTypeRule>() { new KeyValueTypeRule() { Type = ComparerType.TEXTCONTAINS, Key = headers[0].Keys.ToList().First(), Value = headers[0].Values.ToList().First() }  },
                    QueryRules = new List<KeyValueTypeRule>() { new KeyValueTypeRule() { Type = ComparerType.TEXTCONTAINS, Key = queryRules[0].Keys.ToList().First(), Value = queryRules[0].Values.ToList().First() } }, 
                    BodyRules = bodyRules[0] }
            });
            scenarios.Add(new Scenario()
            {
                Id = "id02",
                Metadata = new MetadataInfo { Title = "Scenario 2", Description = "Test Scenario 2" },
                Verb = 0,
                Path = "/pets",
                Response = new MockResponse { Status = StatusCodes.Status200OK, Body = "Testing scenario 2", Headers = headers[1], Type = MockResponseType.CUSTOM },
                RequestMatchRules = new RequestMatchRules {
                    UrlRules = new List<PathTypeRule>() { new PathTypeRule() { Type = ComparerType.TEXTCONTAINS, Path = urlRules[1] } },
                    HeaderRules = new List<KeyValueTypeRule>() { new KeyValueTypeRule() { Type = ComparerType.TEXTCONTAINS, Key = headersRules[1].Keys.ToList().First(), Value = headersRules[1].Values.ToList().First() } },
                    QueryRules = new List<KeyValueTypeRule>() { new KeyValueTypeRule() { Type = ComparerType.TEXTCONTAINS, Key = queryRules[1].Keys.ToList().First(), Value = queryRules[1].Values.ToList().First() } },
                    BodyRules = bodyRules[1] }
            });
            scenarios.Add(new Scenario()
            {
                Id = "id03",
                Metadata = new MetadataInfo { Title = "Scenario 3", Description = "Test Scenario 3" },
                Verb = 0,
                Path = "/pets",
                Response = new MockResponse { Status = StatusCodes.Status200OK, Body = "Scenario 3", Headers = headers[2], Type = MockResponseType.CUSTOM },
                RequestMatchRules = new RequestMatchRules {
                    HeaderRules = new List<KeyValueTypeRule>() { new KeyValueTypeRule(){ Type = ComparerType.TEXTCONTAINS, Key = headersRules[2].Keys.ToList().First(), Value = headersRules[2].Values.ToList().First() } },
                    QueryRules = new List<KeyValueTypeRule>() { new KeyValueTypeRule() { Type = ComparerType.TEXTCONTAINS, Key = queryRules[2].Keys.ToList().First(), Value = queryRules[2].Values.ToList().First() } },
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
