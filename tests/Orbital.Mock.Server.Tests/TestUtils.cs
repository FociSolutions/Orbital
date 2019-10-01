using System;

namespace Orbital.Mock.Server.Tests
{
    /// <summary>
    /// A collection of test utilities to be used for all tests
    /// </summary>
    public static class TestUtils
    {
        private static readonly Random Rand = new Random();

        /// <summary>
        /// By default, generates a random string length from four characters to 128. The minimum string length
        /// is three characters, and has no maximum length.
        /// </summary>
        /// <returns></returns>
        public static int GetRandomStringLength(int min = 4, int max = 128)
        {
            if (min < 4)
            {
                throw new ArgumentException("The random string must be greater than three to ensure sufficient randomness.");
            }

            return Rand.Next(min, max);
        }
    }
}