using MediatR;
using Orbital.Mock.Server.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Diagnostics.CodeAnalysis;

namespace Orbital.Mock.Server.MockDefinitions.Commands
{
    /// <summary>
    /// Class GetAllMockDefinitionsCommand represents a request for getting all mock definitions
    /// </summary>
    [ExcludeFromCodeCoverage]
    public class GetAllMockDefinitionsCommand : IRequest<IEnumerable<MockDefinition>> { }
}
