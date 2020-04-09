using Bogus;
using Scriban.Runtime;

namespace Orbital.Mock.Server.Functions
{
    public class InternetFunctions : ScriptObject
    {
        public static Faker faker;
        public InternetFunctions()
        {
            faker = new Faker();
        }

        /// <summary>
        /// Gets a random avatar
        /// </summary>
        public static string Avatar()
        {
            return faker.Internet.Avatar();
        }

        /// <summary>
        /// Gets a random email
        /// </summary>
        public static string Email()
        {
            return faker.Internet.Email();
        }

        /// <summary>
        /// Gets a random example email
        /// </summary>
        public static string ExampleEmail()
        {
            return faker.Internet.ExampleEmail();
        }

        /// <summary>
        /// Gets a random user name
        /// </summary>
        public static string UserName()
        {
            return faker.Internet.UserName();
        }

        /// <summary>
        /// Gets a random user name unicode
        /// </summary>
        public static string UserNameUnicode()
        {
            return faker.Internet.UserNameUnicode();
        }

        /// <summary>
        /// Gets a random domain name
        /// </summary>
        public static string DomainName()
        {
            return faker.Internet.DomainName();
        }

        /// <summary>
        /// Gets a random domain word
        /// </summary>
        public static string DomainWord()
        {
            return faker.Internet.DomainWord();
        }

        /// <summary>
        /// Gets a random domain suffix
        /// </summary>
        public static string DomainSuffix()
        {
            return faker.Internet.DomainSuffix();
        }

        /// <summary>
        /// Gets a random ip
        /// </summary>
        public static string Ip()
        {
            return faker.Internet.Ip();
        }

        /// <summary>
        /// Gets a random ipv6
        /// </summary>
        public static string Ipv6()
        {
            return faker.Internet.Ipv6();
        }

        /// <summary>
        /// Gets a random user agent
        /// </summary>
        public static string UserAgent()
        {
            return faker.Internet.UserAgent();
        }

        /// <summary>
        /// Gets a random mac
        /// </summary>
        public static string Mac()
        {
            return faker.Internet.Mac();
        }

        /// <summary>
        /// Gets a random password
        /// </summary>
        public static string Password()
        {
            return faker.Internet.Password();
        }

        /// <summary>
        /// Gets a random color
        /// </summary>
        public static string Color()
        {
            return faker.Internet.Color();
        }

        /// <summary>
        /// Gets a random protocol
        /// </summary>
        public static string Protocol()
        {
            return faker.Internet.Protocol();
        }

        /// <summary>
        /// Gets a random url
        /// </summary>
        public static string Url()
        {
            return faker.Internet.Url();
        }

        /// <summary>
        /// Gets a random url with path
        /// </summary>
        public static string UrlWithPath()
        {
            return faker.Internet.UrlWithPath();
        }
    }
}