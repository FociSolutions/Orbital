using Bogus;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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
    }
}