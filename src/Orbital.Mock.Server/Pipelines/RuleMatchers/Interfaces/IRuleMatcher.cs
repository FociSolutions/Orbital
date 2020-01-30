using Orbital.Mock.Server.Models;

namespace Orbital.Mock.Server.Pipelines.RuleMatchers.Interfaces
{
    /// <summary>
    /// Interface contains method signature of matching method
    /// </summary>
    /// <typeparam name="T">Match rule type</typeparam>
    /// <typeparam name="R">Input for matching</typeparam>
    public interface IRuleMatcher
    {
        /// <summary>
        /// Method to determine matching
        /// </summary>
        /// <param name="asserts">Collection of comparison properties</param>
        /// <returns>Whether all asserts match</returns>
        bool Match(Assert[] asserts);
    }
}
