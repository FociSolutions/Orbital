using System;
using System.Linq;
using System.Text;
using System.Collections.Generic;

using System.Net.Http.Headers;
using Microsoft.Net.Http.Headers;

using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;

using Orbital.Mock.Server.Models;
using Orbital.Mock.Server.Pipelines.Filters.Bases;
using Orbital.Mock.Server.Pipelines.Ports.Interfaces;
using Orbital.Mock.Server.Factories;
using Orbital.Mock.Server.Pipelines.RuleMatchers.Interfaces;
using Orbital.Mock.Server.Factories.Interfaces;
using Orbital.Mock.Server.Models.Rules;

namespace Orbital.Mock.Server.Pipelines.Filters
{
    public class TokenRequestMatchFilter<T> : FaultableBaseFilter<T>
        where T : IFaultablePort, ITokenRequestMatchPort, IScenariosPort
    {
        private IAssertFactory AssertFactory;
        private IRuleMatcher RuleMatcher;

        public TokenRequestMatchFilter(IAssertFactory assertFactory, IRuleMatcher ruleMatcher)
        {
            this.AssertFactory = assertFactory;
            this.RuleMatcher = ruleMatcher;
        }


        public override T Process(T port)
        {
            if (!IsPipelineValid(ref port, GetType())) return port;

            var tokenMatchScenarios = port.Scenarios.Where(x => x.RequiresTokenRequestMatch());

            if (CheckValidationResult(tokenMatchScenarios) && port.Token == null)
            {
                port.TokenMatchResults = MatchResult.CreateAll(MatchResultType.Fail, tokenMatchScenarios).ToList();
                return port;
            }

            if (!TryParseTokenMap(port, out Dictionary<string, string> tokenMap))
            {
                port.TokenMatchResults = MatchResult.CreateAll(MatchResultType.Fail, tokenMatchScenarios).ToList();
                return port;
            }

            foreach (var scenario in tokenMatchScenarios)
            {

                foreach (KeyValuePairRule rule in scenario.TokenRule.Rules)
                {
                    var assertList = AssertFactory.CreateAssert(rule, tokenMap);
                    if (!assertList.Any())
                    {
                        // If there incoming claim does not have a matching key, it fails the match
                        port.TokenMatchResults.Add(MatchResult.Create(MatchResultType.Fail, scenario));
                    }
                    else
                    {
                        port.TokenMatchResults.Add(RuleMatcher.Match(assertList.ToArray())
                                        ? MatchResult.Create(MatchResultType.Success, scenario)
                                        : MatchResult.Create(MatchResultType.Fail, scenario));
                    }
                }
            }
            if (!HasSuccessfulScenario(port))
            {
                port.Token = null;
            }

            return port;
        }
    
        /// <summary>
        /// Tries to parse token claims into a map
        /// </summary>
        /// <param name="port"> The ProcessMessagePort</param>
        /// <param name="tokenMap">out - tokenMap</param>
        /// <returns>bool - true if map is parsed</returns>
        static bool TryParseTokenMap(T port, out Dictionary<string, string> tokenMap)
        {
            tokenMap = new Dictionary<string, string>();

            try
            {
                if (port.Token == null)
                {
                    port.Token = new JwtSecurityToken(port.TokenParameter);
                }

                foreach (var claim in port.Token.Claims)
                {
                    tokenMap.Add(claim.Type, claim.Value);
                }
                return true;
            }
            catch
            {
                return false;
            }

        }

        /// <summary>
        /// Returns list of scenarios that have a 
        /// validation type of TokenValidationType.JWT_VALIDATION_AND_REQUEST_MATCH
        /// </summary>
        /// <param name="scenarios"></param>
        /// <returns>An IEnumerabled of Scenarios</returns>
        static bool CheckValidationResult(IEnumerable<Scenario> scenarios)
        {
            return scenarios.Any(s => s.TokenRule.ValidationType == TokenValidationType.JWT_VALIDATION_AND_REQUEST_MATCH);
        }

        /// <summary>
        /// Checks the results and returns true if any scenario result successes match 
        /// the number of rules put in place for a specific scenario
        /// </summary>
        /// <param name="port"></param>
        /// <returns>true if successes match the amount of rules, false otherwise.</returns>
        static bool HasSuccessfulScenario(T port)
        {
            var ruleCountDict = port.Scenarios.ToDictionary(x => x.Id, z => z.TokenRule.Rules.Count);

            return port.TokenMatchResults
                    .GroupBy(r => r.ScenarioId)
                    .Select(r => r.Where(x => x.Match == MatchResultType.Success)
                                  .Count() == ruleCountDict[r.Key])
                    .Any(r => r);
        }
    }
}
