using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Orbital.Mock.Server.Models.Interfaces
{
    interface IPolicy
    {
        PolicyType Type { get; set; }
    }

    /// <summary>
    /// Enum that indicates which policy to use
    /// </summary>
    public enum PolicyType
    {
        NONE = 0,
        DELAYRESPONSE
    };
}
