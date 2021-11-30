using System;
using System.Text;
using System.Linq;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;

using Bogus;
using System.Security.Claims;

namespace Orbital.Mock.Server.Tests
{
    /// <summary>
    /// A collection of test utilities to be used for all tests
    /// </summary>
    public static class TestUtils
    {
        private static readonly Random Rand = new Random();

        public static object databaseLock = new object();

        private const int DefaultMinLength = 4;
        private const int DefaultMaxLength = 128;

        /// <summary>
        /// By default, generates a random string length from four characters to 128. The minimum string length
        /// is three characters, and has no maximum length.
        /// </summary>
        /// <returns></returns>
        public static int GetRandomStringLength(int min = DefaultMinLength, int max = DefaultMaxLength)
        {
            if (min < 4)
            {
                throw new ArgumentException("The random string must be greater than three to ensure sufficient randomness.");
            }

            return Rand.Next(min, max);
        }

        /// <summary>
        /// Generates a random alpha-numeric string using the input Faker object
        /// </summary>
        /// <param name="faker">Input Bogus.Faker object to generate the string</param>
        /// <param name="minLen">[Optional] minimum string length. Defaults to <see cref="DefaultMinLength"/></param>
        /// <param name="maxLen">[Optional] maximum string length. Defaults to <see cref="DefaultMaxLength"/></param>
        /// <returns></returns>
        public static string GetRandomString(Faker faker, int minLen = DefaultMinLength, int maxLen = DefaultMaxLength)
        {
            return faker.Random.AlphaNumeric(GetRandomStringLength(minLen, maxLen));
        }

        /// <summary>
        /// Generates a collection of random alpha-numeric strings using the input Faker object
        /// </summary>
        /// <param name="faker">Input Bogus.Faker object to generate the strings</param>
        /// <param name="numStrings">The desired number of strings to be generated</param>
        /// <param name="minLen">[Optional] minimum string length. Defaults to <see cref="DefaultMinLength"/></param>
        /// <param name="maxLen">[Optional] maximum string length. Defaults to <see cref="DefaultMaxLength"/></param>
        /// <returns></returns>
        public static IEnumerable<string> GetRandomStrings(Faker faker, int numStrings, int minLen = DefaultMinLength, int maxLen = DefaultMaxLength)
        {
            return Enumerable.Range(0, numStrings).Select(x => GetRandomString(faker, minLen, maxLen));
        }

        /// <summary>
        /// Generates a valid JWT (string) given the input 'client secret'
        /// </summary>
        /// <param name="secret">Client secret to be used to sign the JWT</param>
        /// <param name="expiryMinutes">Number of minutes (from DateTime.UtcNow) that the JWT expires - default is 30mins</param>
        /// <returns></returns>
        public static string GenerateJwt(string secret, int expiryMinutes = 30, List<KeyValuePair<string, string>> claims = null)
        {
            var token = GenerateToken(secret, expiryMinutes, claims);

            var handler = new JwtSecurityTokenHandler();
            return handler.WriteToken(token);
        }

        public static string GetJwtFromJwk(string secret, int expiryMinutes = 30)
        {
            var token = GenerateTokenFromJwk(secret, expiryMinutes);
            var handler = new JwtSecurityTokenHandler();
            return handler.WriteToken(token);
        }

        /// <summary>
        /// Generates a valid JwtSecuriyToken given the input 'client secret'
        /// </summary>
        /// <param name="secret">Client secret to be used to sign the JWT</param>
        /// <param name="expiryMinutes">Number of minutes (from DateTime.UtcNow) that the JWT expires - default is 30mins</param>
        /// <returns></returns>
        public static JwtSecurityToken GenerateToken(string secret, int expiryMinutes = 30, 
            List<KeyValuePair<string, string>> claims = null)
        {
            claims ??= new List<KeyValuePair<string, string>>();

            var securityKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(secret));
            ClaimsIdentity claimsIdentity = new ClaimsIdentity(claims.Select(c => new Claim(c.Key, c.Value)));

            var handler = new JwtSecurityTokenHandler();
            var descrip = new SecurityTokenDescriptor()
            {
                Expires = DateTime.UtcNow.AddMinutes(expiryMinutes),
                SigningCredentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256Signature),
                Subject = claimsIdentity
            };

            var token = handler.CreateToken(descrip);
            return token as JwtSecurityToken;
        }

        /// <summary>
        /// Serializes an input JwtSecurityToken into a fully compliant string representation
        /// </summary>
        /// <param name="token">Input JwtSecurityToken to be serialized</param>
        /// <returns></returns>
        public static string SerializeToken(JwtSecurityToken token)
        {
            var handler = new JwtSecurityTokenHandler();
            return handler.WriteToken(token);
        }

        public static JsonWebKey GenerateJwk(string secret)
        {
            var key = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(secret));
            var jwk = JsonWebKeyConverter.ConvertFromSymmetricSecurityKey(key);
            return jwk;
        }

        public static JwtSecurityToken GenerateTokenFromJwk(string secret, int expiryMinutes = 30)
        {
            var jwk = GenerateJwk(secret);

            var handler = new JwtSecurityTokenHandler();
            var descrip = new SecurityTokenDescriptor()
            {
                Expires = DateTime.UtcNow.AddMinutes(expiryMinutes),
                SigningCredentials = new SigningCredentials(jwk, SecurityAlgorithms.HmacSha256)
            };

            var token = handler.CreateToken(descrip);
            return token as JwtSecurityToken;
        }
    }
}