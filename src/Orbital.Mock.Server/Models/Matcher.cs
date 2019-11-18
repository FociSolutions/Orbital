using System.Collections.Generic;
using System.Linq;

namespace Orbital.Mock.Server.Models
{
    public static class Matcher
    {
        // TODO: test this file directly

        /// <summary>
        /// Matches a Dictionary of scenario values to the actual response values
        /// </summary>
        /// <param name="matchRules">The dictionary of match rules that need to be matched</param>
        /// <param name="requestDictionary">The actual response dictionary</param>
        /// <param name="scenarioId">The scenario id to use to create the MatchResult</param>
        /// <returns>The MatchResult corresponding to the match level of these two dictionaries</returns>
        public static MatchResult MatchByKeyValuePair(IDictionary<string, string> matchRules, IDictionary<string, string> requestDictionary, string scenarioId)
        {
            var rule = new MatchResult(MatchResultType.Ignore, scenarioId);

            if (matchRules != null && matchRules.Count > 0)
            {
                rule = matchRules.Except(requestDictionary).Any()
                ? new MatchResult(MatchResultType.Fail, scenarioId)
                : new MatchResult(MatchResultType.Success, scenarioId);
                
            }

            return rule;
        }
    }
}