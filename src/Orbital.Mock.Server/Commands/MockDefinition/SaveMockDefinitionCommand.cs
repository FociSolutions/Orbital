using MediatR;
using Orbital.Mock.Server.Models;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Threading.Tasks;

namespace Orbital.Mock.Server.MockDefinitions.Commands
{
    /// <summary>
    /// Class SaveMockDefinitionCommand represents a request for saving a mock definition to the cache
    /// </summary>

    [ExcludeFromCodeCoverage]
    public class SaveMockDefinitionCommand : IRequest
    {
        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="mockDefinition">Mock definition to store in cache</param>
        public SaveMockDefinitionCommand(MockDefinition mockDefinition)
        {
            this.MockDefinition = mockDefinition;
        }

        /// <summary>
        /// Mockdefinition property
        /// </summary>
        public MockDefinition MockDefinition { get; }
    }
}
