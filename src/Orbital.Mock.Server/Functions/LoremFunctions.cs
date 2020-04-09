using Bogus;
using Scriban.Runtime;

namespace Orbital.Mock.Server.Functions
{
    public class LoremFunctions : ScriptObject
    {
        public static Faker faker;
        public LoremFunctions()
        {
            faker = new Faker();
        }

        /// <summary>
        /// Gets a random word
        /// </summary>
        public static string Word()
        {
            return faker.Lorem.Word();
        }

        /// <summary>
        /// Gets a random words
        /// </summary>
        public static string[] Words()
        {
            return faker.Lorem.Words();
        }

        /// <summary>
        /// Gets a random letter
        /// </summary>
        public static string Letter()
        {
            return faker.Lorem.Letter();
        }

        /// <summary>
        /// Gets a random sentence
        /// </summary>
        public static string Sentence()
        {
            return faker.Lorem.Sentence();
        }

        /// <summary>
        /// Gets a random sentences
        /// </summary>
        public static string Sentences()
        {
            return faker.Lorem.Sentences();
        }

        /// <summary>
        /// Gets a random paragraph
        /// </summary>
        public static string Paragraph()
        {
            return faker.Lorem.Paragraph();
        }

        /// <summary>
        /// Gets a random paragraphs
        /// </summary>
        public static string Paragraphs()
        {
            return faker.Lorem.Paragraphs();
        }

        /// <summary>
        /// Gets a random text
        /// </summary>
        public static string Text()
        {
            return faker.Lorem.Text();
        }

        /// <summary>
        /// Gets a random lines
        /// </summary>
        public static string Lines()
        {
            return faker.Lorem.Lines();
        }

        /// <summary>
        /// Gets a random slug
        /// </summary>
        public static string Slug()
        {
            return faker.Lorem.Slug();
        }
    }
}