using Bogus;
using Scriban.Runtime;

namespace Orbital.Mock.Server.Functions
{
    public class AddressFunctions : ScriptObject
    {
        public static Faker faker;
        public AddressFunctions()
        {
            faker = new Faker();
        }

        /// <summary>
        /// Returns a building number.
        /// </summary>
        public static string BuildingNumber()
        {
            return faker.Address.BuildingNumber();
        }

        /// <summary>
        /// Returns a cardinal direction.
        /// </summary>
        public static string CardinalDirection()
        {
            return faker.Address.CardinalDirection();
        }

        /// <summary>
        /// Returns a city name.
        /// </summary>
        public static string City()
        {
            return faker.Address.City();
        }

        /// <summary>
        /// Returns a city prefix.
        /// </summary>
        public static string CityPrefix()
        {
            return faker.Address.CityPrefix();
        }

        /// <summary>
        /// Returns a city suffix.
        /// </summary>
        public static string CitySuffix()
        {
            return faker.Address.CitySuffix();
        }

        /// <summary>
        /// Returns a country name.
        /// </summary>
        public static string Country()
        {
            return faker.Address.Country();
        }

        /// <summary>
        /// Returns a country code.
        /// </summary>
        public static string CountryCode()
        {
            return faker.Address.CountryCode();
        }

        /// <summary>
        /// Returns a county.
        /// </summary>
        public static string County()
        {
            return faker.Address.County();
        }

        /// <summary>
        /// Returns a direction.
        /// </summary>
        public static string Direction()
        {
            return faker.Address.Direction();
        }

        /// <summary>
        /// Returns a full address.
        /// </summary>
        public static string FullAddress()
        {
            return faker.Address.FullAddress();
        }

        /// <summary>
        /// Returns a latitude.
        /// </summary>
        public static double Latitude()
        {
            return faker.Address.Latitude();
        }

        /// <summary>
        /// Returns a longitude.
        /// </summary>
        public static double Longitude()
        {
            return faker.Address.Longitude();
        }

        /// <summary>
        /// Returns a ordinal direction.
        /// </summary>
        public static string OrdinalDirection()
        {
            return faker.Address.OrdinalDirection();
        }

        /// <summary>
        /// Returns a secondary address.
        /// </summary>
        public static string SecondaryAddress()
        {
            return faker.Address.SecondaryAddress();
        }

        /// <summary>
        /// Returns a state.
        /// </summary>
        public static string State()
        {
            return faker.Address.State();
        }

        /// <summary>
        /// Returns a state abbreviation.
        /// </summary>
        public static string StateAbbr()
        {
            return faker.Address.StateAbbr();
        }

        /// <summary>
        /// Returns a street address.
        /// </summary>
        public static string StreetAddress()
        {
            return faker.Address.StreetAddress();
        }

        /// <summary>
        /// Returns a street name.
        /// </summary>
        public static string StreetName()
        {
            return faker.Address.StreetName();
        }

        /// <summary>
        /// Returns a street suffix.
        /// </summary>
        public static string StreetSuffix()
        {
            return faker.Address.StreetSuffix();
        }

        /// <summary>
        /// Returns a zip code.
        /// </summary>
        public static string ZipCode()
        {
            return faker.Address.ZipCode();
        }
    }
}
