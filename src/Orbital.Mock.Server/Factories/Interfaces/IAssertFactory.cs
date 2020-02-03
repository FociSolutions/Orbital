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
        /// <param name="rules">KeyValuePairRules containing rules and rule type</param>
        /// <param name="request">the request key/value pairs</param>
        /// <returns>An IEnumerable of Assert models containing expected rule, actual values from the request, and the comparer type</returns>
        IEnumerable<Assert> CreateAssert(KeyValuePairRule rules, IEnumerable<KeyValuePair<string, string>> request);

        /// <summary>
        /// Create Assert model based on the body match port provided and the request JToken
        /// </summary>
        /// <param name="rules"> BodyRule containing rules and rule type</param>
        /// <param name="request">the request JToken as a string</param>
        /// <returns>An IEnumerable of Assert models containing expected value, actual values from the request, and the comparer type</returns>
        IEnumerable<Assert> CreateAssert(BodyRule rules, string request);

        /// <summary>
        /// Create Assert model based on the rules provided and the request path
        /// </summary>
        /// <param name="rules">KeyValuePairRules containing rules and rule type</param>
        /// <param name="request">the request path as a string</param>
        /// <returns>An IEnumerable of Assert models containing expected value, actual values from the request, and the comparer type</returns>
        IEnumerable<Assert> CreateAssert(KeyValuePairRule rules, string request);
    }
}
