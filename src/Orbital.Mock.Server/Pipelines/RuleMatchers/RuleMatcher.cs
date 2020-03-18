using Orbital.Mock.Server.Models;
using Orbital.Mock.Server.Models.Interfaces;
using Orbital.Mock.Server.Pipelines.Comparers;
using Orbital.Mock.Server.Pipelines.RuleMatchers.Interfaces;
using System.Linq;

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
            return !asserts.Select(ExecuteComparer).Any(x => !x);
        }

        private bool ExecuteComparer(Assert assert)
        {
            switch (assert.Rule)
            {
                case ComparerType.REGEX:
                    return RegexComparer.Compare(assert.Actual, assert.Expect);
                case ComparerType.TEXTCONTAINS:
                    return TextComparer.Contains(assert.Actual, assert.Expect);
                case ComparerType.TEXTSTARTSWITH:
                    return TextComparer.StartsWith(assert.Actual, assert.Expect);
                case ComparerType.TEXTENDSWITH:
                    return TextComparer.EndsWith(assert.Actual, assert.Expect);
                case ComparerType.TEXTEQUALS:
                    return TextComparer.Equals(assert.Actual, assert.Expect);
                case ComparerType.ACCEPTALL:
                    return true;
                case ComparerType.JSONCONTAINS:
                    return JsonComparer.DeepContains(assert.Expect, assert.Actual);
                case ComparerType.JSONEQUALITY:
                    return JsonComparer.DeepEqual(assert.Expect, assert.Actual);
                case ComparerType.JSONSCHEMA:
                    return JsonComparer.MatchesSchema(assert.Actual, assert.Expect);
                case ComparerType.JSONPATH:
                    return JsonComparer.PathEqual(assert.Expect, assert.Actual);
                default:
                    return false;
            }
        }
    }
}
