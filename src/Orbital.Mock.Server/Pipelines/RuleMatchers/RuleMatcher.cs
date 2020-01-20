using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Orbital.Mock.Server.Models;
using Orbital.Mock.Server.Models.Interfaces;
using Orbital.Mock.Server.Pipelines.Comparers;
using Orbital.Mock.Server.Pipelines.RuleMatchers.Interfaces;
using System;
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
                        case ComparerType.REGEX:
                            isMatch = RegexComparer.Compare(assert.Actual, assert.Expect);

                            break;
                        case ComparerType.TEXTCONTAINS:
                                isMatch = TextComparer.Contains(assert.Actual, assert.Expect);
                            
                            break;
                        case ComparerType.TEXTSTARTSWITH:
                            isMatch = TextComparer.StartsWith(assert.Actual, assert.Expect);

                            break;
                        case ComparerType.TEXTENDSWITH:
                            isMatch = TextComparer.EndsWith(assert.Actual, assert.Expect);

                            break;
                        case ComparerType.TEXTEQUALS:
                            isMatch = TextComparer.Equals(assert.Actual, assert.Expect);

                            break;
                        case ComparerType.JSONCONTAINS:

                        try {
                            var actual = JToken.Parse(assert.Actual);
                            var expected = JToken.Parse(assert.Expect);
                            isMatch = DeepContains(expected.HasValues ? expected.First : expected, actual);
                        }
                        catch (JsonReaderException e)
                        {
                            isMatch = false;
                            break;
                        }
                            

                            break;
                        case ComparerType.JSONEQUALITY:
                        try
                        {
                            var actualEquality = JToken.Parse(assert.Actual);
                            var expectedEquality = JToken.Parse(assert.Expect);
                            isMatch = JToken.DeepEquals(expectedEquality, actualEquality);
                        }
                        catch (JsonReaderException e)
                        {
                            isMatch = false;
                            break;
                        }

                        break;
                        case ComparerType.JSONPATH:

                            break;
                        case ComparerType.JSONSCHEMA:

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
