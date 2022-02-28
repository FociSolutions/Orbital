using System;
using System.IO;
using System.Linq;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

using Microsoft.AspNetCore.Http;

using Orbital.Mock.Definition.Rules;
using Orbital.Mock.Definition.Response;

using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

using Swashbuckle.AspNetCore.Filters;

namespace Orbital.Mock.Definition.Examples
{
    [ExcludeFromCodeCoverage]
    public class MockDefinitionsModelExamples : IExamplesProvider<object>
    {
        const int Count = 3;

        /// <summary>
        /// Created a json example to show when the server is fired up.
        /// </summary>
        /// <returns>A MockDefinition with different scenarios</returns>
        public object GetExamples()
        {
            return new
            {
                Host = "petstore.swagger.io",
                BasePath = "/api",
                Metadata = new MetadataInfo
                {
                    Title = "Test Title",
                    Description = "Test Description"
                },
                OpenApi = JsonConvert.DeserializeObject(File.ReadAllText(Path.Combine("Examples", "SwaggerSchemaExamples", "OpenApiDocumentSwaggerSchemaExample.json"))),
                Scenarios = GenerateScenarios()
            };
        }

        static List<Scenario> GenerateScenarios()
        {
            var headers = GetHeaderContents();

            var urlRules = GetUrlRules();
            var bodyRules = GetBodyRules();
            var queryRules = GetQueryRules();
            var headerRules = GetHeaderRules();

            var scens = Enumerable.Range(0, Count)
                                  .Select(i => new Scenario()
                                  {
                                      Id = $"id{(i + 1).ToString().PadLeft(2, '0')}",
                                      Verb = 0,
                                      Path = "/pets",
                                      Metadata = GenerateMetadata(i),
                                      Response = GenerateResponse(i, headers),
                                      RequestMatchRules = new RequestMatchRules
                                      {
                                          HeaderRules = (i == 0) ? GetHeaderRuleFromHeader(headers.First()) : headerRules,
                                          UrlRules = (i == 1) ? urlRules : new List<PathTypeRule>(),
                                          QueryRules = queryRules,
                                          BodyRules = bodyRules
                                      }
                                  }).ToList();
            return scens;
        }

        static Dictionary<string, string> GetHeaderContents()
        {
            string dtStart = DateTime.UtcNow.ToString();
            string dtEnd = DateTime.UtcNow.AddHours(0.5).ToString();

            return new Dictionary<string, string>()
            {
                { "Date", dtStart },
                { "Expires", dtEnd },
                { "Cache-Control: public", "max-age=6000" }
            };
        }

        static List<PathTypeRule> GetUrlRules()
        {
            return new List<PathTypeRule>()
            {
                new PathTypeRule() { Path = @"url/pets", Type = ComparerType.TEXTCONTAINS},
                new PathTypeRule() { Path = @"url/pet", Type = ComparerType.TEXTCONTAINS},
                new PathTypeRule() { Path = @"url/p", Type = ComparerType.TEXTCONTAINS}
            };
        }

        static List<KeyValueTypeRule> GetHeaderRules()
        {
            return new Dictionary<string, string>()
            {
                { "Range", "bytes=0-1999" },
                { "Content-Type", "application/json" },
                { "Content-Length", "216513521" }
            }.Select(kvp => new KeyValueTypeRule() { Type = ComparerType.TEXTCONTAINS, Key = kvp.Key, Value = kvp.Value }).ToList();
        }

        static List<KeyValueTypeRule> GetHeaderRuleFromHeader(KeyValuePair<string, string> kvp)
        {
            return new List<KeyValueTypeRule>() { new KeyValueTypeRule() { Type = ComparerType.TEXTCONTAINS, Key = kvp.Key, Value = kvp.Value } };
        }

        static List<KeyValueTypeRule> GetQueryRules()
        {
            return new Dictionary<string, string>()
            {
                { "key", "http://petstore.swagger.io/v2/documents:analyzeEntities?Key=API_KEY" },
                { "alt", "json" },
                { "prettyPrint", "true" }
            }.Select(kvp => new KeyValueTypeRule() { Type = ComparerType.TEXTCONTAINS, Key = kvp.Key, Value = kvp.Value }).ToList();
        }

        static List<BodyRule> GetBodyRules()
        {
            return new List<BodyRule>()
            {
                new BodyRule(ComparerType.JSONCONTAINS, JObject.FromObject(new { ruleType = "Use Body Contains" })),
                new BodyRule(ComparerType.JSONEQUALITY, JObject.FromObject(new { ruleType = "Use Body Equality" }))
            };
        }

        static MetadataInfo GenerateMetadata(int index)
        {
            return new MetadataInfo { Title = $"Scenario {index + 1}", Description = $"Test Scenario {index + 1}" };
        }

        static MockResponse GenerateResponse(int index, IDictionary<string, string> headers)
        {
            return new MockResponse
            {
                Status = (index == 0) ? 0 : StatusCodes.Status200OK,
                Body = $"Scenario {index + 1}",
                Headers = headers,
                Type = MockResponseType.CUSTOM
            };
        }


    }
}
