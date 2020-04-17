using Bogus;
using Scriban.Runtime;

namespace Orbital.Mock.Server.Functions
{
    public class CommerceFunctions : ScriptObject
    {
        public static Faker faker;

        public CommerceFunctions()
        {
            faker = new Faker();
        }

        /// <summary>
        /// Returns a colour
        /// </summary>
        public static string Color()
        {
            return faker.Commerce.Color();
        }

        /// <summary>
        /// Returns a department
        /// </summary>
        public static string Department()
        {
            return faker.Commerce.Department();
        }

        /// <summary>
        /// Returns an Ean13 barcode
        /// </summary>
        public static string Ean13()
        {
            return faker.Commerce.Ean13();
        }

        /// <summary>
        ///  Returns an Ean8 barcode
        /// </summary>
        public static string Ean8()
        {
            return faker.Commerce.Ean8();
        }

        /// <summary>
        /// Returns a price
        /// </summary>
        public static string Price()
        {
            return faker.Commerce.Price();
        }

        /// <summary>
        /// Returns a product
        /// </summary>
        public static string Product()
        {
            return faker.Commerce.Product();
        }

        /// <summary>
        /// Returns a product adjective
        /// </summary>
        public static string ProductAdjective()
        {
            return faker.Commerce.ProductAdjective();
        }

        /// <summary>
        /// Returns a product material
        /// </summary>
        public static string ProductMaterial()
        {
            return faker.Commerce.ProductMaterial();
        }

        /// <summary>
        /// Returns a product name
        /// </summary>
        public static string ProductName()
        {
            return faker.Commerce.ProductName();
        }
    }
}
