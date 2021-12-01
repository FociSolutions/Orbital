using Microsoft.IdentityModel.Tokens;
using System.Collections.Generic;

namespace Orbital.Mock.Server.Services.Interfaces
{
    /// <summary>
    /// Interface for a public key management service used to retrieve
    /// and cache public keys in the JWK format.
    /// </summary>
    public interface IPublicKeyService
    {
        /// <summary>
        /// Gets a JsonWebKey from any configured sources by looking it up by its Key ID
        /// </summary>
        /// <param name="keyId">The ID of the JsonWebKey</param>
        /// <returns>A JsonWebKey object or null if there is no key associated to the provided key id</returns>
        JsonWebKey GetKey(string keyId);

        /// <summary>
        /// Gets a JsonWebKey from any configured sources by looking it up by its Key ID
        /// </summary>
        /// <param name="token">The String representation of the token that is being validated.</param>
        /// <param name="securityToken">The SecurityToken that is being validated. It may be null.</param>
        /// <param name="kid">A key identifier. It may be null.</param>
        /// <param name="validationParameters">TokenValidationParameters required for validation.</param>
        /// <returns>Valid SecurityKey(s) to use when validating a signature.</returns>
        IEnumerable<SecurityKey> IssuerSigningKeyResolver(string token, SecurityToken securityToken, string kid, TokenValidationParameters validationParameters);
    }
}
