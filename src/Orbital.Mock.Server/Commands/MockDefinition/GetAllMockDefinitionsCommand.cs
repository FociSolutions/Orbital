using MediatR;
using Orbital.Mock.Server.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Orbital.Mock.Server.MockDefinitions.Commands
{
    /// <summary>
    /// Class GetAllMockDefinitionsCommand represents a request for getting all mock definitions
    /// </summary>
    public class GetAllMockDefinitionsCommand : IRequest<List<MockDefinition>>
    {
        /// <summary>
        /// Constructor
        /// </summary>
        public GetAllMockDefinitionsCommand()
        {
        }

    }
}
