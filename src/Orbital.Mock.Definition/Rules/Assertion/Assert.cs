using Orbital.Mock.Definition.Rules.Assertion.Interfaces;

namespace Orbital.Mock.Definition.Rules.Assertion
{
    /// <summary>
    /// Class that designates comparison properties
    /// </summary>
    public class Assert : IAssert
    {
        public string Actual { get; set; }
        public string Expected { get; set; }

        public ComparerType Rule { get; set; }

        public static Assert Create(string actual, string expected, ComparerType ruleType)
        {
            return new Assert() { Actual = actual, Expected = expected, Rule = ruleType };
        }
    }
}
