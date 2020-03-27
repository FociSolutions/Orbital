using Bogus;
using Scriban.Runtime;

namespace Orbital.Mock.Server.Functions
{
    public class HackerFunctions : ScriptObject
    {
        public static Faker faker;
        public HackerFunctions()
        {
            faker = new Faker();
        }

        /// <summary>
        /// Gets a random abbreviation
        /// </summary>
        public static string Abbreviation()
        {
            return faker.Hacker.Abbreviation();
        }

        /// <summary>
        /// Gets a random adjective
        /// </summary>
        public static string Adjective()
        {
            return faker.Hacker.Adjective();
        }

        /// <summary>
        /// Gets a random noun
        /// </summary>
        public static string Noun()
        {
            return faker.Hacker.Noun();
        }

        /// <summary>
        /// Gets a random verb
        /// </summary>
        public static string Verb()
        {
            return faker.Hacker.Verb();
        }

        /// <summary>
        /// Gets a random ing verb
        /// </summary>
        public static string IngVerb()
        {
            return faker.Hacker.IngVerb();
        }

        /// <summary>
        /// Gets a random phrase
        /// </summary>
        public static string Phrase()
        {
            return faker.Hacker.Phrase();
        }
    }
}