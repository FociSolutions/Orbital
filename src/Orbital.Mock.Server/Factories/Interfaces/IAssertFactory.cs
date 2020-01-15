using Orbital.Mock.Server.Models;
using Orbital.Mock.Server.Models.Rules;
using System.Collections.Generic;

namespace Orbital.Mock.Server.Factories.Interfaces
{
    public interface IAssertFactory
    {
        /// <summary>
        /// Create Assert model based on the rules provided and the request IEnumerable of key/value pair
        /// </summary>
        /// <param name="rules">A collection of KeyValuePairRules containing rules and rule type</param>
        /// <param name="request">the request key/value pairs</param>
        /// <returns>An IEnumerable of Assert models containing expected rule, actual</returns>
        IEnumerable<Assert> CreateAssert(ICollection<KeyValuePairRule> rules, IEnumerable<KeyValuePair<string, string>> request);

        /// <summary>
        /// Create Assert model based on the body match port provided and the request JToken
        /// </summary>
        /// <param name="rules">A collection of BodyRules containing rules and rule type</param>
        /// <param name="request">the request JToken as a string</param>
        /// <returns>An IEnumerable of Assert models containing expected rule, actual</returns>
        IEnumerable<Assert> CreateAssert(ICollection<BodyRule> rules, string request);
    }
}
