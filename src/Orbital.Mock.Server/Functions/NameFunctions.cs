using Bogus;
using Scriban.Runtime;

namespace Orbital.Mock.Server.Functions
{
    public class NameFunctions : ScriptObject
    {
        public static Faker faker;
        public NameFunctions()
        {
            faker = new Faker();
        }

        /// <summary>
        /// Returns a full name.
        /// </summary>
        public static string FullName()
        {
            return faker.Name.FullName();
        }

        /// <summary>
        /// Returns a first name.
        /// </summary>
        public static string FirstName()
        {
            return faker.Name.FirstName();
        }

        /// <summary>
        /// Returns a last name.
        /// </summary>
        public static string LastName()
        {
            return faker.Name.LastName();
        }

        /// <summary>
        /// Returns a job area.
        /// </summary>
        public static string JobArea()
        {
            return faker.Name.JobArea();
        }

        /// <summary>
        /// Returns a job description.
        /// </summary>
        public static string JobDescriptor()
        {
            return faker.Name.JobDescriptor();
        }

        /// <summary>
        /// Returns a job title.
        /// </summary>
        public static string JobTitle()
        {
            return faker.Name.JobTitle();
        }

        /// <summary>
        /// Returns a job type.
        /// </summary>
        public static string JobType()
        {
            return faker.Name.JobType();
        }

        /// <summary>
        /// Returns a name prefix.
        /// </summary>
        public static string Prefix()
        {

            return faker.Name.Prefix();
        }

        /// <summary>
        /// Returns a name suffix.
        /// </summary>
        public static string Suffix()
        {

            return faker.Name.Suffix();
        }
    }
}
