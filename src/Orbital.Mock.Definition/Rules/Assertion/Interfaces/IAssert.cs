namespace Orbital.Mock.Definition.Rules.Assertion.Interfaces
{
    internal interface IAssert
    {
        /// <summary>
        /// Assert Property designating actual value
        /// </summary>
        public string Actual { get; }
        /// <summary>
        /// Assert Property designating Expected value
        /// </summary>
        public string Expected { get; }
        /// <summary>
        /// Assert Property designating the comparer type
        /// </summary>
        public ComparerType Rule { get; }
    }
}
