using Orbital.Mock.Server.Factories.Interfaces;
using Orbital.Mock.Server.Models;
using Orbital.Mock.Server.Models.Interfaces;
using Orbital.Mock.Server.Pipelines.Ports.Interfaces;
using System.Collections.Generic;
using System.Linq;

namespace Orbital.Mock.Server.Factories
{
    public class AssertFactory : IAssertFactory
    {
        /// <inheritdoc />
        public IEnumerable<Assert> CreateAssert(IQueryMatchPort port, IEnumerable<KeyValuePair<string, string>> request)
        {
            var asserts = new List<Assert>();
            foreach (var kvpRequest in request)
            {
                AddAsserts(port.Query, asserts, kvpRequest, port.Type);
            }


            return asserts;
        }

        /// <inheritdoc />
        public IEnumerable<Assert> CreateAssert(IBodyMatchPort port, string request)
        {
            var asserts = new List<Assert>();
            var bodyAssert = new Assert() { Actual = request, Expect = port.Body, Rule = port.Type };
            asserts.Add(bodyAssert);

            return asserts;
        }

        /// <inheritdoc />
        public IEnumerable<Assert> CreateAssert(IHeaderMatchPort port, IEnumerable<KeyValuePair<string, string>> request)
        {
            var asserts = new List<Assert>();

            foreach (var kvpRequest in request)
            {
                AddAsserts(port.Headers, asserts, kvpRequest, port.Type);
            }

            return asserts;
        }

        /// <summary>
        /// This will take in the port key/value pair list, the list of asserts, and the request key/value pair list
        /// to confirm there is a match in the keys, create 2 asserts for the key and value, and finally add them to the list.
        /// </summary>
        /// <param name="portKvs">Key/value pair list from the port</param>
        /// <param name="asserts">List of asserts to be returned from the factory</param>
        /// <param name="kvpRequest">List of key/value pairs from the request</param>
        /// <param name="comparerType">Type of comparer to be used against the request</param>
        private static void AddAsserts(IEnumerable<KeyValuePair<string, string>> portKvs, List<Assert> asserts, KeyValuePair<string, string> kvpRequest, ComparerType comparerType)
        {
            var assert = portKvs.Where(kv => kv.Key == kvpRequest.Key);
            var queryheaderkeyassert = new Assert() { Actual = kvpRequest.Key, Expect = assert.First().Key, Rule = comparerType };
            var queryheadervalueassert = new Assert() { Actual = kvpRequest.Value, Expect = assert.First().Value, Rule = comparerType };
            asserts.Add(queryheaderkeyassert);
            asserts.Add(queryheadervalueassert);
        }
    }
}
