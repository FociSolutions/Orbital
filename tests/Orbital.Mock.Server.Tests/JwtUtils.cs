using System;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using System.Security.Cryptography;
using Microsoft.IdentityModel.Tokens;

namespace Orbital.Mock.Server.Tests
{
    public class JwtUtils
    {
        public const int DEFAULT_EXPIRY_MINUTES = 30;

        /// <summary>
        /// Creates a new SymmetricSecurityKey using the provided secret
        /// </summary>
        /// <param name="secret">A string that will be used to generate the bytes of the secret</param>
        public static SymmetricSecurityKey CreateSymmetricJwk(string secret)
        {
            return new SymmetricSecurityKey(Encoding.ASCII.GetBytes(secret))
            {
                KeyId = Guid.NewGuid().ToString()
            };
        }

        /// <summary>
        /// Creates a new AsymmetricSecurityKey using the provided key size
        /// </summary>
        /// <param name="bits">The key size in bits</param>
        public static AsymmetricSecurityKey CreateAsymmetricJwk(int bits = 2048)
        {
            return new RsaSecurityKey(RSA.Create(bits))
            {
                KeyId = Guid.NewGuid().ToString()
            };
        }

        /// <summary>
        /// Serializes an input JwtSecurityToken into a fully compliant string representation
        /// </summary>
        /// <param name="token">Input JwtSecurityToken to be serialized</param>
        public static string SerializeJwt(JwtSecurityToken token) => new JwtSecurityTokenHandler().WriteToken(token);

        /// <summary>
        /// Creates a JSON Web Token and base64 encodes it
        /// </summary>
        /// <param name="key">The security key used to sign the token</param>
        /// <param name="expiryMinutes">
        /// If positive, how many minutes the token should be valid for.
        /// If negative, how many minutes ago the token expired.
        /// If zero, the token will not have an expiration time.
        /// </param>
        public static string CreateEncodedJwt(AsymmetricSecurityKey key, int expiryMinutes = DEFAULT_EXPIRY_MINUTES)
        {
            return SerializeJwt(CreateJwt(key, expiryMinutes));
        }

        /// <summary>
        /// Creates a JSON Web Token and base64 encodes it
        /// </summary>
        /// <param name="key">The security key used to sign the token</param>
        /// <param name="expiryMinutes">
        /// If positive, how many minutes the token should be valid for.
        /// If negative, how many minutes ago the token expired.
        /// If zero, the token will not have an expiration time.
        /// </param>
        public static string CreateEncodedJwt(SymmetricSecurityKey key, int expiryMinutes = DEFAULT_EXPIRY_MINUTES)
        {
            return SerializeJwt(CreateJwt(key, expiryMinutes));
        }

        /// <summary>
        /// Creates a JSON Web Token
        /// </summary>
        /// <param name="key">The security key used to sign the token</param>
        /// <param name="expiryMinutes">
        /// If positive, how many minutes the token should be valid for.
        /// If negative, how many minutes ago the token expired.
        /// If zero, the token will not have an expiration time.
        /// </param>
        public static JwtSecurityToken CreateJwt(AsymmetricSecurityKey key, int expiryMinutes = DEFAULT_EXPIRY_MINUTES)
        {
            return CreateJwt(new SigningCredentials(key, SecurityAlgorithms.RsaSha256), expiryMinutes);
        }

        /// <summary>
        /// Creates a JSON Web Token
        /// </summary>
        /// <param name="key">The security key used to sign the token</param>
        /// <param name="expiryMinutes">
        /// If positive, how many minutes the token should be valid for.
        /// If negative, how many minutes ago the token expired.
        /// If zero, the token will not have an expiration time.
        /// </param>
        public static JwtSecurityToken CreateJwt(SymmetricSecurityKey key, int expiryMinutes = DEFAULT_EXPIRY_MINUTES)
        {
            return CreateJwt(new SigningCredentials(key, SecurityAlgorithms.HmacSha256), expiryMinutes);
        }

        /// <summary>
        /// Creates a JSON Web Token
        /// </summary>
        /// <param name="credentials">The SigningCredentials object used to sign the token</param>
        /// <param name="expiryMinutes">
        /// If positive, how many minutes the token should be valid for.
        /// If negative, how many minutes ago the token expired.
        /// If zero, the token will not have an expiration time.
        /// </param>
        public static JwtSecurityToken CreateJwt(SigningCredentials credentials, int expiryMinutes = DEFAULT_EXPIRY_MINUTES)
        {
            var handler = new JwtSecurityTokenHandler();

            if (expiryMinutes == 0)
            {
                var header = new JwtHeader(credentials);
                var payload = new JwtPayload();
                return new JwtSecurityToken(header, payload);
            }

            var descrip = expiryMinutes > 0
                ? new SecurityTokenDescriptor()
                {
                    SigningCredentials = credentials,
                    Expires = DateTime.UtcNow.AddMinutes(expiryMinutes),
                }
                : new SecurityTokenDescriptor()
                {
                    SigningCredentials = credentials,
                    Expires = DateTime.UtcNow.AddMinutes(expiryMinutes),
                    IssuedAt = DateTime.UtcNow.AddMinutes(expiryMinutes - 10),
                    NotBefore = DateTime.UtcNow.AddMinutes(expiryMinutes - 10),
                };


            var token = handler.CreateToken(descrip);
            return token as JwtSecurityToken;
        }


    }
}
