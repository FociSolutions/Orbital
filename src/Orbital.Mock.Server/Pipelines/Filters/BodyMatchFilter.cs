using System;
using System.Linq;
using System.Collections.Generic;

using Orbital.Mock.Definition;
using Orbital.Mock.Definition.Match;
using Orbital.Mock.Definition.Rules.Assertion;
using Orbital.Mock.Server.Pipelines.Filters.Bases;
using Orbital.Mock.Server.Pipelines.Ports.Interfaces;
using Orbital.Mock.Server.Pipelines.RuleMatchers.Interfaces;

using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Orbital.Mock.Server.Pipelines.Filters
{
    public class BodyMatchFilter<T> : FaultableBaseFilter<T>
        where T : IFaultablePort, IBodyMatchPort, IScenariosPort
    {
        private IRuleMatcher ruleMatcher;

        public BodyMatchFilter(IRuleMatcher ruleMatcher)
        {
            this.ruleMatcher = ruleMatcher;
        }
        /// <summary>
        /// Process that returns the port after adding a list of scenario Id's
        /// that have any body rule that matches the body of the request.
        /// </summary>
        /// <param name="port">The port containing necessary data</param>
        /// <returns>Port containing processed data</returns>
        public override T Process(T port)
        {
            if (!IsPipelineValid(ref port, GetType())) return port;

            if (!TryParseBody(port.Body, out var bodyObject, out _))
            {
                port.BodyMatchResults = GenerateJsonBodyErrorResults(port.Scenarios);
            }
            else
            {
                
                foreach (var scenario in port.Scenarios)
                {
                    foreach(var rule in scenario.RequestMatchRules.BodyRules)
                    {
                        var assertsList = AssertFactory.CreateAssert(rule, port.Body);
                        port.BodyMatchResults.Add(ruleMatcher.Match(assertsList.ToArray())
                                   ? new MatchResult(MatchResultType.Success, scenario.Id, scenario.DefaultScenario)
                                     : new MatchResult(MatchResultType.Fail, scenario.Id, scenario.DefaultScenario));
                    }
                }
            }

            return port;
        }

        /// <summary>
        /// Generates the match rules if the raw request body isn't valid for this filter
        /// </summary>
        /// <param name="scenarios">The scenarios on the port</param>
        private static List<MatchResult> GenerateJsonBodyErrorResults(IEnumerable<Scenario> scenarios)
        {
            return scenarios.Select(scenario => scenario.RequestMatchRules.BodyRules.Any() ? MatchResult.Create(MatchResultType.Fail, scenario) 
                                                                                           : MatchResult.Create(MatchResultType.Ignore, scenario))
                            .ToList();
        }

        /// <summary>
        /// Try to turn the request body into Json.
        /// Return false if the body doesn't parse successfully and set jObject to null,
        /// allowing JavaScript empty JSON to be parsed correctly
        /// </summary>
        /// <param name="body">The raw request body</param>
        /// <param name="jObject">The JObject</param>
        /// <param name="ex">The exception thrown if there was a JSON parsing error</param>
        /// <returns>False if the parse failed and true if successful</returns>
        private static bool TryParseBody(string body, out JToken jObject, out Exception ex)
        {
            ex = null;
            // check if the body is an empty string (which is technically valid JSON) and set it to something that C#
            // can understand
            if (!JsonIsNullOrEmpty(body)) return TryParseStrict(body, out jObject);

            jObject = new JObject();
            return true;
        }

        /// <summary>
        /// Parses the JSON so that null or empty JSON is considered invalid
        /// </summary>
        /// <param name="body">The body of the request (a JSON string)</param>
        /// <param name="jObject">The output parsed JSON; null if it could not be parsed</param>
        private static bool TryParseStrict(string body, out JToken jObject)
        {
            try
            {
                jObject = JToken.Parse(body);
            }
            catch (JsonReaderException)
            {
                jObject = null;
                return false;
            }

            return true;
        }

        /// <summary>
        /// Checks if a JSON string is null or empty (e.g. {}, [], null)
        /// This is required because JavaScript allows for empty JSON strings, but the parser
        /// causes them to be parsed as invalid syntax. This allows those objects to be parsed
        /// correctly so that the designer files are interoperable with the server.
        /// </summary>
        /// <param name="jsonString">The JSON string to parse</param>
        private static bool JsonIsNullOrEmpty(string jsonString)
        {
            if (TryParseStrict(jsonString, out var token))
            {
                return (token == null) ||
                       (token.Type == JTokenType.Array && !token.HasValues) ||
                       (token.Type == JTokenType.Object && !token.HasValues) ||
                       (token.Type == JTokenType.String && token.ToString() == string.Empty) ||
                       (token.Type == JTokenType.Null);
            }

            return true;
        }


        /// <summary>
        /// Checks if a JSON object is contained within another one recursively
        /// </summary>
        /// <param name="needle">The object to check</param>
        /// <param name="haystack">The larger object to check against</param>
        /// <returns>Whether it contains the JSON object</returns>
        private static bool DeepContains(JToken needle, JToken haystack)
        {
            foreach (JProperty prop in haystack.OfType<JProperty>())
            {
                if (JToken.DeepEquals(needle, prop) || DeepContains(needle, prop.Value))
                {
                    return true;
                }
            }
            return false;
        }

    }
}