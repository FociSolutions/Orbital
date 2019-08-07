using MediatR;
using Orbital.Mock.Server.Models;
using System.Collections.Generic;

namespace Orbital.Mock.Server.MockDefinitions.Commands
{
    /// <summary>
    /// Class GetAllMockDefinitionsCommand represents a request for getting all mock definitions
    /// </summary>
    public class GetAllMockDefinitionsCommand : IRequest<IEnumerable<MockDefinition>>
    {
        /// <summary>
        /// Constructor
        /// </summary>
        public GetAllMockDefinitionsCommand()
        {
        }

    }
}
