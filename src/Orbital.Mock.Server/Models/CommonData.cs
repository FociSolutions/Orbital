using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Threading.Tasks;

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
