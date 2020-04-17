using Bogus;
using Scriban.Runtime;

namespace Orbital.Mock.Server.Functions
{
    public class ImageFunctions : ScriptObject
    {
        public static Faker faker;
        public ImageFunctions()
        {
            faker = new Faker();
        }

        /// <summary>
        /// Gets a random picsum url
        /// </summary>
        public static string PicsumUrl()
        {
            return faker.Image.PicsumUrl();
        }

        /// <summary>
        /// Gets a random lorem flickr url
        /// </summary>
        public static string LoremFlickrUrl()
        {
            return faker.Image.LoremFlickrUrl();
        }

        /// <summary>
        /// Gets a random lorem pixel url
        /// </summary>
        public static string LoremPixelUrl()
        {
            return faker.Image.LoremPixelUrl();
        }

        /// <summary>
        /// Gets a random image
        /// </summary>
        public static string Image()
        {
            return faker.Image.Image();
        }

        /// <summary>
        /// Gets a random abstract
        /// </summary>
        public static string Abstract()
        {
            return faker.Image.Abstract();
        }

        /// <summary>
        /// Gets a random animals
        /// </summary>
        public static string Animals()
        {
            return faker.Image.Animals();
        }

        /// <summary>
        /// Gets a random business
        /// </summary>
        public static string Business()
        {
            return faker.Image.Business();
        }

        /// <summary>
        /// Gets a random cats
        /// </summary>
        public static string Cats()
        {
            return faker.Image.Cats();
        }

        /// <summary>
        /// Gets a random city
        /// </summary>
        public static string City()
        {
            return faker.Image.City();
        }

        /// <summary>
        /// Gets a random food
        /// </summary>
        public static string Food()
        {
            return faker.Image.Food();
        }

        /// <summary>
        /// Gets a random nightlife
        /// </summary>
        public static string Nightlife()
        {
            return faker.Image.Nightlife();
        }

        /// <summary>
        /// Gets a random fashion
        /// </summary>
        public static string Fashion()
        {
            return faker.Image.Fashion();
        }

        /// <summary>
        /// Gets a random people
        /// </summary>
        public static string People()
        {
            return faker.Image.People();
        }

        /// <summary>
        /// Gets a random nature
        /// </summary>
        public static string Nature()
        {
            return faker.Image.Nature();
        }

        /// <summary>
        /// Gets a random sports
        /// </summary>
        public static string Sports()
        {
            return faker.Image.Sports();
        }

        /// <summary>
        /// Gets a random technics
        /// </summary>
        public static string Technics()
        {
            return faker.Image.Technics();
        }

        /// <summary>
        /// Gets a random transport
        /// </summary>
        public static string Transport()
        {
            return faker.Image.Transport();
        }
    }
}