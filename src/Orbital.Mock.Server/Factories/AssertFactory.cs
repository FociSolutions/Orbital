using Orbital.Mock.Server.Factories.Interfaces;
using Orbital.Mock.Server.Models;
using Orbital.Mock.Server.Models.Interfaces;
using Orbital.Mock.Server.Models.Rules;
using System.Collections.Generic;
using System.Linq;

namespace Orbital.Mock.Server.Factories
{
    public class AssertFactory : IAssertFactory
    {

        /// <inheritdoc />
        public IEnumerable<Assert> CreateAssert(BodyRule rule, string request)
        {
            var asserts = new List<Assert>();
            var bodyAssert = new Assert() { Actual = request, Expect = rule.RuleValue.ToString(), Rule = rule.Type };
            asserts.Add(bodyAssert);

            return asserts;
        }

        /// <inheritdoc />
        public IEnumerable<Assert> CreateAssert(KeyValuePairRule rule, IEnumerable<KeyValuePair<string, string>> request)
        {
            var ruleAsserts = new List<Assert>();

            foreach (var kvpRequest in request)
            {
                if (kvpRequest.Key == rule.RuleValue.Key)
                {
                    var queryheaderkeyassert = new Assert()
                    {
                        Expect = rule.RuleValue.Key,
                        Actual = kvpRequest.Key,
                        Rule = ComparerType.TEXTEQUALS
                    };

                    var queryheadervalueassert = new Assert() { Actual = kvpRequest.Value, Expect = rule.RuleValue.Value, Rule = rule.Type };

                    ruleAsserts.Add(queryheaderkeyassert);
                    ruleAsserts.Add(queryheadervalueassert);
                }
            }
            return ruleAsserts;
        }

    }
}
