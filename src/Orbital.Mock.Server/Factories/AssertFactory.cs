using Orbital.Mock.Server.Factories.Interfaces;
using Orbital.Mock.Server.Models;
using Orbital.Mock.Server.Models.Interfaces;
using Orbital.Mock.Server.Models.Rules;
using System.Collections.Generic;

namespace Orbital.Mock.Server.Factories
{
    public class AssertFactory : IAssertFactory
    {

        /// <inheritdoc />
        public IEnumerable<Assert> CreateAssert(BodyRule rule, string request)
        {
            var asserts = new List<Assert>();
            var bodyAssert = new Assert() { Actual = request, Expect = rule.Value, Rule = rule.Type };
            asserts.Add(bodyAssert);

            return asserts;
        }

        /// <inheritdoc />
        public IEnumerable<Assert> CreateAssert(KeyValueTypeRule rule, IEnumerable<KeyValuePair<string, string>> request)
        {
            var ruleAsserts = new List<Assert>();

            foreach (var kvpRequest in request)
            {
                if (kvpRequest.Key == rule.Key)
                {
                    var queryheaderkeyassert = new Assert()
                    {
                        Expect = rule.Key,
                        Actual = kvpRequest.Key,
                        Rule = ComparerType.TEXTEQUALS
                    };

                    var queryheadervalueassert = new Assert() { Actual = kvpRequest.Value, Expect = rule.Value, Rule = rule.Type };

                    ruleAsserts.Add(queryheaderkeyassert);
                    ruleAsserts.Add(queryheadervalueassert);
                }
            }
            return ruleAsserts;
        }

        /// <inheritdoc />
        public IEnumerable<Assert> CreateAssert(KeyValueTypeRule rules, string request)
        {
            var asserts = new List<Assert>();
            var UrlAssert = new Assert() { Actual = request, Expect = rules.Value, Rule = rules.Type };
            asserts.Add(UrlAssert);

            return asserts;

        }

        /// <inheritdoc />
        public IEnumerable<Assert> CreateAssert(PathTypeRule rules, string request)
        {
            var asserts = new List<Assert>();
            var UrlAssert = new Assert() { Actual = request, Expect = rules.Path, Rule = rules.Type };
            asserts.Add(UrlAssert);

            return asserts;
        }
    }
}
