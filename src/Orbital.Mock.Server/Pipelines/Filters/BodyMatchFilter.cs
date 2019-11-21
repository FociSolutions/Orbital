using System;
using System.Collections.Generic;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Orbital.Mock.Server.Pipelines.Filters.Bases;
using Orbital.Mock.Server.Pipelines.Ports.Interfaces;
using System.Linq;
using Orbital.Mock.Server.Models;

namespace Orbital.Mock.Server.Pipelines.Filters
{
    public class BodyMatchFilter<T> : FaultableBaseFilter<T>
        where T : IFaultablePort, IBodyMatchPort, IScenariosPort
    {
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
                GenerateJsonBodyErrorResults(port.Scenarios);
            }
            else
            {
                port.BodyMatchResults = port.Scenarios.SelectMany(s => ProcessScenarios(bodyObject, s)).ToList();
            }

            return port;
        }

        /// <summary>
        /// Generates the match rules if the raw request body isn't valid for this filter
        /// </summary>
        /// <param name="scenarios">The scenarios on the port</param>
        private static void GenerateJsonBodyErrorResults(IEnumerable<Scenario> scenarios)
        {
            scenarios.Select(scenario => scenario.RequestMatchRules.BodyRules.Any()
                ? new MatchResult(MatchResultType.Fail, scenario.Id)
                : new MatchResult(MatchResultType.Ignore, scenario.Id));
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
        /// Get the match result for the scenario for a given JObject request
        /// </summary>
        /// <param name="bodyObject">The request json</param>
        /// <param name="scenario">The scenario to match against</param>
        private static IEnumerable<MatchResult> ProcessScenarios(JToken bodyObject, Scenario scenario)
        {
            if(scenario.RequestMatchRules.BodyRules == null)
            {
                var rules = new List<MatchResult>() { new MatchResult(MatchResultType.Ignore, scenario.Id)};
                return rules;
            }

            return scenario.RequestMatchRules.BodyRules.Select(br => BodyCheck(br.Rule, br.Type, bodyObject, scenario.Id)).ToList();
        }

        /// <summary>
        /// Checks to see if the body in the request matches the body in the scenario using DeepEquals
        /// </summary>
        /// <param name="bodyRule">The rule to process</param>
        /// <param name="bodyObject">The request json object</param>
        /// <param name="scenarioId">The scenario being worked against</param>
        private static MatchResult BodyEquality(JToken bodyRule, JToken bodyObject, string scenarioId)
        {
            MatchResult successfulResult = new MatchResult(MatchResultType.Success, scenarioId);
            MatchResult failureResult = new MatchResult(MatchResultType.Fail, scenarioId);
            if (bodyObject.Type == JTokenType.String && bodyRule.Type == JTokenType.String)
            {
                return bodyObject.Value<string>().Equals(bodyRule.Value<string>()) ?
                successfulResult :
                failureResult;
            }
            return JToken.DeepEquals(bodyRule, bodyObject)
                ? successfulResult
                : failureResult;
        }

        /// <summary>
        /// Checks if a string or JSON object is contained within another one
        /// </summary>
        /// <param name="bodyRule">The body rule to check</param>
        /// <param name="bodyObject">The contents of the body rule</param>
        /// <param name="scenarioId">The id of the scenario</param>
        /// <returns>Whether it contains the JSON object or string, depending on the incoming type</returns>
        private static MatchResult BodyContains(JToken bodyRule, JToken bodyObject, string scenarioId)
        {
            MatchResult successfulResult = new MatchResult(MatchResultType.Success, scenarioId);
            MatchResult failureResult = new MatchResult(MatchResultType.Fail, scenarioId);
            if (bodyObject.Type == JTokenType.String && bodyRule.Type == JTokenType.String)
            {
                return bodyObject.Value<string>().Contains(bodyRule.Value<string>()) ?
                successfulResult :
                failureResult;
            }
            return DeepContains(bodyRule.HasValues ? bodyRule.First : bodyRule, bodyObject) ?
                successfulResult :
                failureResult;
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

        /// <summary>
        /// Checks if the body contains or equals the match rule
        /// </summary>
        /// <param name="bodyRule">The body rule to check</param>
        /// <param name="bodyRuleType">The type of the body rule</param>
        /// <param name="bodyObject">The contents of the body to check</param>
        /// <param name="scenarioId">The id of the scenario</param>
        /// <returns>The processed match result</returns>
        private static MatchResult BodyCheck(JToken bodyRule, BodyRuleTypes bodyRuleType, JToken bodyObject, string scenarioId)
        {
            var matchResult = new MatchResult(MatchResultType.Fail, scenarioId);

            switch (bodyRuleType)
            {
                case BodyRuleTypes.BodyContains:
                    matchResult = BodyContains(bodyRule, bodyObject, scenarioId);
                    break;
                case BodyRuleTypes.BodyEquality:
                    matchResult = BodyEquality(bodyRule, bodyObject, scenarioId);
                    break;
            }

            return matchResult;
        }
    }
}