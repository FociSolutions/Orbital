using Newtonsoft.Json.Linq;
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
            var isMatch = true;
            foreach(var assert in asserts)
            {
                    switch (assert.Rule)
                    {
                        case ComparerType.Regex:
                            isMatch = RegexComparer.Compare(assert.Actual, assert.Expect);
                            break;
                        case ComparerType.Contains:
                            try
                            {
                                var actual = JToken.Parse(assert.Actual);
                                var expected = JToken.Parse(assert.Expect);
                                isMatch = DeepContains(expected.HasValues ? expected.First : expected, actual);
                            }
                            catch
                            {
                                isMatch = TextComparer.Contains(assert.Actual, assert.Expect);
                            }
                            
                            break;
                        case ComparerType.StartWith:
                            isMatch = TextComparer.StartsWith(assert.Actual, assert.Expect);
                        break;
                        case ComparerType.EndWith:
                            isMatch = TextComparer.EndsWith(assert.Actual, assert.Expect);
                        break;
                        case ComparerType.Equal:
                            try
                            {
                                var actual = JToken.Parse(assert.Actual);
                                var expected = JToken.Parse(assert.Expect);
                                isMatch = JToken.DeepEquals(expected, actual);
                            }
                            catch
                            {
                               isMatch = TextComparer.Equals(assert.Actual, assert.Expect);
                        }
                           
                            break;
                    }
            }
            return isMatch;
        }

        /// <summary>
        /// Checks if a JSON object is contained within another one recursively
        /// </summary>
        /// <param name="needle">The object to check</param>
        /// <param name="haystack">The larger object to check against</param>
        /// <returns>Whether it contains the JSON object</returns>
        private bool DeepContains(JToken needle, JToken haystack)
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
