using Orbital.Mock.Server.Models;
using Orbital.Mock.Server.Pipelines.RuleMatchers.Interfaces;

namespace Orbital.Mock.Server.Pipelines.RuleMatchers
{
    /// <summary>
    /// Abstract class for matching 
    /// </summary>
    abstract class RuleMatcher : IRuleMatcher
    {
        /// <summary>
        /// Method to match properties in the assert collection
        /// </summary>
        /// <param name="asserts">collection of assert objects</param>
        /// <returns></returns>
        public abstract bool Match(Assert[] asserts);
    }
}
