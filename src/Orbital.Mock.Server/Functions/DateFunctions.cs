using Bogus;
using Scriban.Runtime;

namespace Orbital.Mock.Server.Functions
{
    public class DateFunctions : ScriptObject
    {
        public static Faker faker;
        public DateFunctions()
        {
            faker = new Faker();
        }

        /// <summary>
        ///  Returns a month of the year
        /// </summary>
        public static string Month()
        {
            return faker.Date.Month();
        }

        /// <summary>
        ///  Returns a day of the week
        /// </summary>
        public static string Weekday()
        {
            return faker.Date.Weekday();
        }

        /// <summary>
        ///  Returns a date in the future
        /// </summary>
        public static string Future()
        {
            return faker.Date.Future().ToString();
        }

        /// <summary>
        ///  Returns a timespan
        /// </summary>
        public static string Timespan()
        {
            return faker.Date.Timespan().ToString();
        }

        /// <summary>
        ///  Returns a date time that will happen soon
        /// </summary>
        public static string Soon()
        {
            return faker.Date.Soon().ToString();
        }

        /// <summary>
        ///  Returns random date time within the last few days
        /// </summary>
        public static string Recent()
        {
            return faker.Date.Recent().ToString();
        }

        /// <summary>
        ///  Returns a date time in the past
        /// </summary>
        public static string Past()
        {
            return faker.Date.Past().ToString();
        }
    }
}
