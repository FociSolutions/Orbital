using System;

using Bogus;
using Scriban.Runtime;

namespace Orbital.Mock.Server.Functions
{
    public class RantFunctions : ScriptObject
    {
        public static Faker faker;
        public RantFunctions()
        {
            faker = new Faker();
        }

        /// <summary>
        /// Returns a random user review
        /// </summary>
        public static string Review()
        {
            return faker.Rant.Review();
        }

        /// <summary>
        /// Returns a string of an array of reviews
        /// </summary>
        public static string Reviews()
        {
            return string.Join(" ", faker.Rant.Reviews());
        }

        /// <summary>
        /// Returns a string of a random short
        /// </summary>
        public static string Short()
        {
            return faker.Rant.Random.Short().ToString();
        }

        /// <summary>
        /// Returns a random string 
        /// </summary>
        public static string String()
        {
            return faker.Rant.Random.String();
        }

        /// <summary>
        /// Returns a string of an unsigned Int
        /// </summary>
        public static string UInt()
        {
            return Convert.ToString(faker.Rant.Random.UInt());
        }

        /// <summary>
        /// Returns a string of an unsigned Long
        /// </summary>
        public static string ULong()
        {
            return faker.Rant.Random.ULong().ToString();
        }

        /// <summary>
        /// Returns a string of an unsigned Short
        /// </summary>
        public static string UShort()
        {
            return faker.Rant.Random.UShort().ToString();
        }

        /// <summary>
        /// Returns a utf 16 string (16-bit Unicode Transformation Format)
        /// </summary>
        public static string Utf16String()
        {
            return faker.Rant.Random.Utf16String();
        }

        /// <summary>
        /// Returns a string of a GUID
        /// </summary>
        public static string Uuid()
        {
            return faker.Rant.Random.Uuid().ToString();
        }

        /// <summary>
        /// Returns a single word or phrase in english
        /// </summary>
        public static string Word()
        {
            return faker.Rant.Random.Word();
        }

        /// <summary>
        /// Returns some random words or phrases in english
        /// </summary>
        public static string Words()
        {
            return faker.Rant.Random.Words();
        }
    }
}
