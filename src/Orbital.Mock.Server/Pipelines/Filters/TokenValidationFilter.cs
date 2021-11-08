using System;
using System.Linq;
using System.Text;
using System.Collections.Generic;

using System.Net.Http.Headers;
using Microsoft.Net.Http.Headers;

using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;

using Orbital.Mock.Server.Models;
using Orbital.Mock.Server.Pipelines.Filters.Bases;
using Orbital.Mock.Server.Pipelines.Ports.Interfaces;

namespace Orbital.Mock.Server.Pipelines.Filters
{
    public static class TokenConstants
    {
        public static readonly string Bearer = "Bearer";
    }

    public class TokenValidationFilter<T> : FaultableBaseFilter<T>
        where T : IFaultablePort, ITokenValidationPort, IScenariosPort
    {
        /// <summary>
        /// Attempts to validate the authenticity of the extracted JWT (if available)
        /// </summary>
        /// <param name="port">The port containing requisite data</param>
        /// <returns></returns>
        public override T Process(T port)
        {
            if (!IsPipelineValid(ref port, GetType())) return port;

            var tokenScenarios = port.Scenarios.Where(x => x.RequiresTokenValidation());

            if (!port.SigningKeys.Any())
            {
                foreach (var scenario in tokenScenarios)
                {
                    port.TokenValidationResults.Add(MatchResult.Create(MatchResultType.Ignore, scenario));
                }
            }
            else
            {
                if (!TryValidateToken(port, out JwtSecurityToken validToken))
                {
                    port.Token = null;
                }
                else
                {
                    port.Token = validToken;
                }

                foreach (var scenario in tokenScenarios)
                {
                    var res = port.Token != null ? MatchResultType.Success : MatchResultType.Fail;
                    port.TokenValidationResults.Add(MatchResult.Create(res, scenario));
                }
            }

            return port;
        }

        /// <summary>
        /// Attempt to validate the raw (encoded) JWT string against all available signing keys
        /// </summary>
        /// <param name="port">ITokenValidationPort containing all requisite inputs (token scheme, token string, signing keys)</param>
        /// <param name="validToken">Output 'valid' JwtSecurityToken - null if validation fails</param>
        /// <returns></returns>
        static bool TryValidateToken(ITokenValidationPort port, out JwtSecurityToken validToken)
        {
            var handler = new JwtSecurityTokenHandler();
            try
            {
                if (!string.Equals(port.TokenScheme, TokenConstants.Bearer, StringComparison.OrdinalIgnoreCase))
                    throw new ArgumentException($"Invalid Authorization scheme: {port.TokenScheme}");

                handler.ValidateToken(port.TokenParameter, new TokenValidationParameters
                {
                    ValidateAudience = false,
                    ValidateIssuer = false,
                    ValidateLifetime = false,
                    ValidateIssuerSigningKey = true,
                    TryAllIssuerSigningKeys = true,
                    IssuerSigningKeys = ParseSecurityKeys(port.SigningKeys)
                }, out SecurityToken validatedToken);

                validToken = (JwtSecurityToken)validatedToken;
            }
            catch (Exception)
            {
                validToken = null;
                return false;
            }
            return true;
        }

        /// <summary>
        /// Converts string-based signing keys to SymmetricSecurityKeys
        /// </summary>
        /// <param name="keys">IEnumerable containing all available signing keys</param>
        /// <returns></returns>
        static IEnumerable<SecurityKey> ParseSecurityKeys(IEnumerable<string> keys)
        {
            return keys.Select(key => new SymmetricSecurityKey(Encoding.ASCII.GetBytes(key))).ToList();
        }
    }
}
