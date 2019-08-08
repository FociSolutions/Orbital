using MediatR;
using Orbital.Mock.Server.Models;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Threading.Tasks;


namespace Orbital.Mock.Server.MockDefinitions.Commands
{
    /// <summary>
    /// Class GetAllMockDefinitionsCommand represents a request for getting all mock definitions
    /// </summary>

    [ExcludeFromCodeCoverage]
    public class GetAllMockDefinitionsCommand : IRequest<IEnumerable<MockDefinition>> { }

}
