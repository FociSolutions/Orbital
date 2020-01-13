using Newtonsoft.Json.Linq;
using Orbital.Mock.Server.Factories.Interfaces;
using Orbital.Mock.Server.Models;
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
                        var assert = port.Headers.Where(kv => kv.Key == kvpRequest.Key);
                        var querykeyassert = new Assert() { Actual = kvpRequest.Key, Expect = assert.First().Key, Rule = port.Type };
                        var queryvalueassert = new Assert() { Actual = kvpRequest.Value, Expect = assert.First().Value, Rule = port.Type };
                        asserts.Add(querykeyassert);
                        asserts.Add(queryvalueassert);
                    }
                    
               break;

                case IHeaderMatchPort headerType:
                    foreach (var kvpRequest in request)
                    {
                        var assert = port.Query.Where(kv => kv.Key == kvpRequest.Key);
                        var headerkeyassert = new Assert() { Actual = kvpRequest.Key, Expect = assert.First().Key, Rule = port.Type };
                        var headervalueassert = new Assert() { Actual = kvpRequest.Value, Expect = assert.First().Value, Rule = port.Type };
                        asserts.Add(headerkeyassert);
                        asserts.Add(headervalueassert);
                    }
                break;
            }

            return asserts;
        }
    }
}
