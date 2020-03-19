using System.Diagnostics.CodeAnalysis;

namespace Orbital.Mock.Server.Models
{
    /// <summary>
    /// Class created to share common data between other classes
    /// </summary>
    [ExcludeFromCodeCoverage]
    public class CommonData
    {
        public string mockIds { get { return "mockIds"; } }
    }
}
