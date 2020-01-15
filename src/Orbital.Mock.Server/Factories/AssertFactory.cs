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
        public IEnumerable<Assert> CreateAssert(ICollection<BodyRule> rules, string request)
        {
            var asserts = new List<Assert>();
            foreach(var rule in rules)
            {
                var bodyAssert = new Assert() { Actual = request, Expect = rule.RuleValue.ToString(), Rule = rule.Type };
                asserts.Add(bodyAssert);
            }

            return asserts;
        }

        /// <inheritdoc />
        public IEnumerable<Assert> CreateAssert(ICollection<KeyValuePairRule> rules, IEnumerable<KeyValuePair<string, string>> request)
        {
            var asserts = new List<Assert>();

            foreach (var kvpRequest in request)
            {
                AddAsserts(rules, asserts, kvpRequest);
            }

            return asserts;
        }

        /// <summary>
        /// This will take in the port key/value pair list, the list of asserts, and the request key/value pair list
        /// to confirm there is a match in the keys, create 2 asserts for the key and value, and finally add them to the list.
        /// </summary>
        /// <param name="rules">Key/value pair list rules</param>
        /// <param name="asserts">List of asserts to be returned from the factory</param>
        /// <param name="kvpRequest">List of key/value pairs from the request</param>
        private static void AddAsserts(ICollection<KeyValuePairRule> rules, List<Assert> asserts, KeyValuePair<string, string> kvpRequest)
        {
            var assert = rules.Where(kv => kv.RuleValue.Key == kvpRequest.Key);
            var queryheaderkeyassert = new Assert() { Actual = kvpRequest.Key, Expect = assert.First().RuleValue.Key, Rule = ComparerType.Equal };
            var queryheadervalueassert = new Assert() { Actual = kvpRequest.Value, Expect = assert.First().RuleValue.Value, Rule = assert.First().Type };
            asserts.Add(queryheaderkeyassert);
            asserts.Add(queryheadervalueassert);
        }
    }
}
