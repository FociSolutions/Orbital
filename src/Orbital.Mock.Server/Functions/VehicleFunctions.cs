using Bogus;
using Scriban.Runtime;

namespace Orbital.Mock.Server.Functions
{
    public class VehicleFunctions : ScriptObject
    {
        public static Faker faker;
        public VehicleFunctions()
        {
            faker = new Faker();
        }

        /// <summary>
        /// Returns a fuel type
        /// </summary>
        public static string Fuel()
        {
            return faker.Vehicle.Fuel();
        }

        /// <summary>
        /// Returns a vehicle manufacturer
        /// </summary>
        public static string Manufacturer()
        {
            return faker.Vehicle.Manufacturer();
        }

        /// <summary>
        /// Returns a vehicle model
        /// </summary>
        public static string Model()
        {
            return faker.Vehicle.Model();
        }

        /// <summary>
        /// Returns a vehicle type
        /// </summary>
        public static string Type()
        {
            return faker.Vehicle.Type();
        }

        /// <summary>
        /// Returns a vehicle vin
        /// </summary>
        public static string Vin()
        {
            return faker.Vehicle.Vin();
        }
    }
}
