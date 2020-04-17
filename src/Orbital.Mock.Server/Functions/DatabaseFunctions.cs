using Bogus;
using Scriban.Runtime;

namespace Orbital.Mock.Server.Functions
{
    public class DatabaseFunctions : ScriptObject
    {
        public static Faker faker;
        public DatabaseFunctions()
        {
            faker = new Faker();
        }

        /// <summary>
        /// Returns a collation.
        /// </summary>
        public static string Collation()
        {
            return faker.Database.Collation();
        }

        /// <summary>
        /// Returns a column name.
        /// </summary>
        public static string Column()
        {
            return faker.Database.Column();
        }

        /// <summary>
        /// Returns a storage engine name.
        /// </summary>
        public static string Engine()
        {
            return faker.Database.Engine();
        }

        /// <summary>
        /// Returns a type name.
        /// </summary>
        public static string Type()
        {
            return faker.Database.Type();
        }
    }
}
