using Orbital.Mock.Server.Models.Interfaces;

namespace Orbital.Mock.Server.Models
{
    /// <summary>
    /// Class that designates comparison properties
    /// </summary>
    public class Assert
    {
        /// <summary>
        /// Assert Property designating actual value
        /// </summary>
        public string Actual { get; set; }
        /// <summary>
        /// Assert Property designating Expected value
        /// </summary>
        public string Expect { get; set; }
        /// <summary>
        /// Assert Property designating the comparer type
        /// </summary>
        public ComparerType Rule { get; set; }
    }
}
