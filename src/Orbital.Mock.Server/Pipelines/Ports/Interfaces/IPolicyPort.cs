using Orbital.Mock.Server.Models;
using Orbital.Mock.Server.Models.Interfaces;
using System.Collections.Generic;

namespace Orbital.Mock.Server.Pipelines.Ports.Interfaces
{
    public interface IPolicyPort
    {
        /**
         * The type of the policy
         */
        PolicyType Type { get; set; }

        /**
         * The list of policies to be used
         */
        IEnumerable<Policy> Policies { get; set; }
    }
}
