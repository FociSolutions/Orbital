using MediatR;
using Orbital.Mock.Server.Models;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace Orbital.Mock.Server.MockDefinitions.Commands
{
    /// <summary>
    /// Class GetAllMockDefinitionsCommand represents a request for getting all mock definitions
    /// </summary>
    [ExcludeFromCodeCoverage]
    public class GetAllMockDefinitionsCommand : IRequest<IEnumerable<MockDefinition>>
    {
        /// <summary>
        /// The database lock
        /// </summary>
        public object databaseLock;

        public GetAllMockDefinitionsCommand(ref object databaseLock)
        {
            this.databaseLock = databaseLock;
        }
    }
}
