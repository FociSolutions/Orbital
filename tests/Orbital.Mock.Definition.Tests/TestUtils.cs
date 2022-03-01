using System;
using System.Text;
using System.Linq;
using System.Collections.Generic;

namespace Orbital.Mock.Definition.Tests
{
    internal static class TestUtils
    {
        private static readonly Random Rand = new Random();

        private const int DefaultMinLength = 4;
        private const int DefaultMaxLength = 128;

        /// <summary>
        /// By default, generates a random string length from four characters to 128. The minimum string length
        /// is three characters, and has no maximum length.
        /// </summary>
        /// <returns></returns>
        public static int GetRandomStringLength(int min = DefaultMinLength, int max = DefaultMaxLength)
        {
            if (min < 4)
            {
                throw new ArgumentException("The random string must be greater than three to ensure sufficient randomness.");
            }

            return Rand.Next(min, max);
        }
    }
}
