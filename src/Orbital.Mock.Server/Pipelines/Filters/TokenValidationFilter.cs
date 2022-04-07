using System;
using System.Linq;
using System.IdentityModel.Tokens.Jwt;

using Microsoft.IdentityModel.Tokens;

using Orbital.Mock.Definition.Match;

using Orbital.Mock.Server.Pipelines.Filters.Bases;
using Orbital.Mock.Server.Pipelines.Ports.Interfaces;
using Orbital.Mock.Server.Services.Interfaces;

using Serilog;

namespace Orbital.Mock.Server.Pipelines.Filters
{
    public static class TokenConstants
    {
        public const string Bearer = "Bearer";
    }

    public class TokenValidationFilter<T> : FaultableBaseFilter<T>
        where T : IFaultablePort, ITokenValidationPort, IScenariosPort
    {

        readonly IPublicKeyService PubKeyService;
        readonly TokenValidationParameters ValidationParams;

        public TokenValidationFilter(IPublicKeyService pubKeyService)
        {
            PubKeyService = pubKeyService;

            ValidationParams = new TokenValidationParameters
            {
                ValidateAudience = false,
                ValidateIssuer = false,
                ValidateLifetime = true,
                RequireExpirationTime = true,
                RequireSignedTokens = true,
                ValidateIssuerSigningKey = true,
                TryAllIssuerSigningKeys = true,
                IssuerSigningKeyResolver = PubKeyService.IssuerSigningKeyResolver,
            };
        }

        /// <summary>
        /// Attempts to validate the authenticity of the extracted JWT (if available)
        /// </summary>
        /// <param name="port">The port containing requisite data</param>
        /// <returns></returns>
        public override T Process(T port)
        {
            if (!IsPipelineValid(ref port, GetType())) return port;

            var tokenScenarios = port.Scenarios.Where(x => x.RequiresTokenValidation());

            var tokenIsValid = TryValidateToken(port, out JwtSecurityToken maybeValidToken);
            port.Token = maybeValidToken;

            foreach (var scenario in tokenScenarios)
            {
                var res = tokenIsValid ? MatchResultType.Success : MatchResultType.Fail;
                port.TokenValidationResults.Add(MatchResult.Create(res, scenario));
            }

            return port;
        }

        /// <summary>
        /// Attempt to validate the raw (encoded) JWT string against all available signing keys
        /// </summary>
        /// <param name="port">ITokenValidationPort containing all requisite inputs (token scheme, token string, signing keys)</param>
        /// <param name="maybeValidToken">Output 'valid' JwtSecurityToken - null if validation fails</param>
        /// <returns></returns>
        bool TryValidateToken(ITokenValidationPort port, out JwtSecurityToken maybeValidToken)
        {
            var handler = new JwtSecurityTokenHandler();
            try
            {
                ValidateAuthScheme(port);

                handler.ValidateToken(port.TokenParameter, ValidationParams, out SecurityToken validatedToken);

                maybeValidToken = validatedToken as JwtSecurityToken;

                return true;
            }
            catch (Exception ex)
            {
                Log.Warning(ex, "Token validation failure");
                maybeValidToken = null;
                return false;
            }
        }

        /// <summary>
        /// Checks if the Authorization scheme is valid. Throws an exception if it is not. 
        /// </summary>
        /// <exception cref="ArgumentException">If the scheme is not valid</exception>
        /// <param name="port"></param>
        static void ValidateAuthScheme(ITokenValidationPort port)
        {
            if (!string.Equals(port.TokenScheme, TokenConstants.Bearer, StringComparison.OrdinalIgnoreCase))
            {
                throw new ArgumentException($"Invalid Authorization scheme: {port.TokenScheme}");
            }
        }
    }
}
