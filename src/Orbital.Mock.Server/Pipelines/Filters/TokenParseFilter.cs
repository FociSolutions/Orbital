using System;
using System.Linq;

using System.Net.Http.Headers;
using Microsoft.Net.Http.Headers;

using Orbital.Mock.Server.Pipelines.Filters.Bases;
using Orbital.Mock.Server.Pipelines.Ports.Interfaces;

namespace Orbital.Mock.Server.Pipelines.Filters
{
    public class TokenParseFilter<T> : FaultableBaseFilter<T>
        where T : IFaultablePort, ITokenParsePort, IScenariosPort
    {
        /// <summary>
        /// Attempts to extract the JWT token from the incoming HttpRequest's header values
        /// </summary>
        /// <param name="port">The port containing requisite data</param>
        /// <returns></returns>
        public override T Process(T port)
        {
            if (!IsPipelineValid(ref port, GetType())) return port;

            if (!TryParseToken(port, out string scheme, out string param))
            {
                port.TokenScheme = null;
                port.TokenParameter = null;
            }
            else
            {
                port.TokenScheme = scheme;
                port.TokenParameter = param;
            }

            return port;
        }

        /// <summary>
        /// Attempt to parse the raw (encoded) JWT from available HttpRequest header values
        /// </summary>
        /// <param name="port">ITokenParsePort containing all available HttpRequest header values</param>
        /// <param name="scheme">Output Authorization scheme (ie. Bearer) - null if absent</param>
        /// <param name="param">Output raw (encoded) JWT token - null if absent</param>
        /// <returns></returns>
        private static bool TryParseToken(ITokenParsePort port, out string scheme, out string param)
        {
            try
            {
                //< Attempt to grab the 'Authorization' KVP, then extract the value
                var auth = port.Headers.Where(kvp => kvp.Key == HeaderNames.Authorization)
                                       .Single().Value;

                //< Attempt to parse the incoming Authorization value
                if (!AuthenticationHeaderValue.TryParse(auth, out var headerValue))
                {
                    throw new ArgumentException($"Invalid Authorization HttpRequest header encountered: {auth}");
                }

                //< Assign the scheme (ie. Bearer) and parameter (ie. encoded JWT)
                scheme = headerValue.Scheme;
                param = headerValue.Parameter;

                //< Ensure neither the scheme nor the parameter are null
                if (scheme == null || param == null)
                {
                    throw new ArgumentException($"Malformed Authorization HttpRequest header value encountered: {auth}");
                }
            }
            catch (Exception)
            {
                scheme = null;
                param = null;
                return false;
            }
            return true;
        }
    }
}
