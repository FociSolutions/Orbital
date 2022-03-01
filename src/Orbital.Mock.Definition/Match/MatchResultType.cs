namespace Orbital.Mock.Definition.Match
{
    /// <summary>
    /// The relevancy of this scenario to the actual request
    /// </summary>
    public enum MatchResultType
    {
        /// <summary>
        /// There were no rules to match against
        /// </summary>
        Ignore = 0,
        /// <summary>
        /// The rule did not match exactly
        /// </summary>
        Fail,
        /// <summary>
        /// The rule matched exactly
        /// </summary>
        Success
    }
}