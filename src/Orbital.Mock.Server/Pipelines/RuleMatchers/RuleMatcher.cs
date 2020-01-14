using Orbital.Mock.Server.Models;
using Orbital.Mock.Server.Models.Interfaces;
using Orbital.Mock.Server.Pipelines.Comparers;
using Orbital.Mock.Server.Pipelines.RuleMatchers.Interfaces;

namespace Orbital.Mock.Server.Pipelines.RuleMatchers
{
    /// <summary>
    /// Abstract class for matching 
    /// </summary>
    public class RuleMatcher : IRuleMatcher
    {
        /// <inheritdoc/>
        public bool Match(Assert[] asserts)
        {
            var isMatch = false;
            foreach(var assert in asserts)
            {
                switch (assert.Rule)
                {
                    case ComparerType.Regex:
                       isMatch = RegexComparer.Compare(assert.Actual, assert.Expect);
                        break;
                    case ComparerType.Contains:
                        break;
                    case ComparerType.StartWith:
                        break;
                    case ComparerType.EndWith:
                        break;
                    case ComparerType.Equal:
                        break;
                }
            }
            return isMatch;
        }
    }
}
