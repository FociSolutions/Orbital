using Newtonsoft.Json.Linq;
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
        public IEnumerable<Assert> CreateAssert<T, R>(T port, R request) where T : IQueryMatchPort, IBodyMatchPort, IHeaderMatchPort where R: JToken, IEnumerable<KeyValuePair<string, string>>
        {
            var asserts = new List<Assert>();
            switch (port.GetType())
            {
                case IBodyMatchPort bodyType:
                    var bodyAssert = new Assert() { Actual = request.ToString(), Expect = port.Body, Rule = port.Type };
                    asserts.Add(bodyAssert);
                break;

                case IQueryMatchPort queryType:
                    foreach(var kvpRequest in request)
                    {
                        AddAsserts(port.Query, asserts, kvpRequest, port.Type);
                    }

                    break;

                case IHeaderMatchPort headerType:
                    foreach (var kvpRequest in request)
                    {
                        AddAsserts(port.Headers, asserts, kvpRequest, port.Type);
                    }
                break;
            }

            return asserts;
        }

        /// <summary>
        /// This will take in the port, the list of asserts and 
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="portKvs"></param>
        /// <param name="asserts"></param>
        /// <param name="kvpRequest"></param>
        /// <param name="comparerType"></param>
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
