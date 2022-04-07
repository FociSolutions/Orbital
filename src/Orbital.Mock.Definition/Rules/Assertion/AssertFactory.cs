using System.Collections.Generic;

namespace Orbital.Mock.Definition.Rules.Assertion
{
    public static class AssertFactory
    {
        public static IEnumerable<Assert> CreateAssert(BodyRule rule, string request)
        {
            return new List<Assert>() { Assert.Create(request, rule.Value, rule.Type) };
        }

        public static IEnumerable<Assert> CreateAssert(KeyValueTypeRule rules, string request)
        {
            return new List<Assert>() { Assert.Create(request, rules.Value, rules.Type) };
        }

        public static IEnumerable<Assert> CreateAssert(PathTypeRule rules, string request)
        {
            return new List<Assert>() { Assert.Create(request, rules.Path, rules.Type) };
        }

        public static IEnumerable<Assert> CreateAssert(KeyValueTypeRule rule, IEnumerable<KeyValuePair<string, string>> request)
        {
            var ruleAsserts = new List<Assert>();

            foreach (var kvpRequest in request)
            {
                if (kvpRequest.Key == rule.Key)
                {
                    ruleAsserts.Add(Assert.Create(kvpRequest.Key, rule.Key, ComparerType.TEXTEQUALS));
                    ruleAsserts.Add(Assert.Create(kvpRequest.Value, rule.Value, rule.Type));
                }
            }
            return ruleAsserts;
        }
    }
}
