using Newtonsoft.Json.Linq;
using Orbital.Mock.Server.Models;
using Orbital.Mock.Server.Pipelines.Ports.Interfaces;
using System.Collections.Generic;

namespace Orbital.Mock.Server.Factories.Interfaces
{
    public interface IAssertFactory
    {
        /// <summary>
        /// Create Assert model based on the query match port provided and the request IEnumerable of key/value pair
        /// </summary>
        /// <param name="port">The query match port containing query rules and rule type</param>
        /// <param name="request">the request key/value pairs</param>
        /// <returns>An IEnumerable of Assert models containing expected rule, actual</returns>
        IEnumerable<Assert> CreateAssert(IQueryMatchPort port, IEnumerable<KeyValuePair<string, string>> request);

        /// <summary>
        /// Create Assert model based on the body match port provided and the request JToken
        /// </summary>
        /// <param name="port">The body match port containing query rules and rule type</param>
        /// <param name="request">the request JToken as a string</param>
        /// <returns>An IEnumerable of Assert models containing expected rule, actual</returns>
        IEnumerable<Assert> CreateAssert(IBodyMatchPort port, string request);

        /// <summary>
        /// Create Assert model based on the header match port provided and the request IEnumerable of key/value pair
        /// </summary>
        /// <param name="port">The header match port containing query rules and rule type</param>
        /// <param name="request">the request key/value pairs</param>
        /// <returns>An IEnumerable of Assert models containing expected rule, actual</returns>
        IEnumerable<Assert> CreateAssert(IHeaderMatchPort port, IEnumerable<KeyValuePair<string, string>> request);
    }
}
