using System.Linq;

using Orbital.Mock.Definition.Rules;
using Orbital.Mock.Definition.Rules.Assertion;

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
            return !asserts.Select(ExecuteComparer).Any(x => !x);
        }

        private bool ExecuteComparer(Assert assert)
        {
            switch (assert.Rule)
            {
                case ComparerType.REGEX:
                    return RegexComparer.Compare(assert.Actual, assert.Expected);
                case ComparerType.TEXTCONTAINS:
                    return TextComparer.Contains(assert.Actual, assert.Expected);
                case ComparerType.TEXTSTARTSWITH:
                    return TextComparer.StartsWith(assert.Actual, assert.Expected);
                case ComparerType.TEXTENDSWITH:
                    return TextComparer.EndsWith(assert.Actual, assert.Expected);
                case ComparerType.TEXTEQUALS:
                    return TextComparer.Equals(assert.Actual, assert.Expected);
                case ComparerType.ACCEPTALL:
                    return true;
                case ComparerType.JSONCONTAINS:
                    return JsonComparer.DeepContains(assert.Expected, assert.Actual);
                case ComparerType.JSONEQUALITY:
                    return JsonComparer.DeepEqual(assert.Expected, assert.Actual);
                case ComparerType.JSONSCHEMA:
                    return JsonComparer.MatchesSchema(assert.Actual, assert.Expected);
                case ComparerType.JSONPATH:
                    return JsonComparer.PathEqual(assert.Expected, assert.Actual);
                default:
                    return false;
            }
        }
    }
}
