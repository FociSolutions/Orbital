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
    /// Request to update a mock definition by its title
    /// </summary>
    [ExcludeFromCodeCoverage]
    public class UpdateMockDefinitionByTitleCommand : IRequest<MockDefinition>
    {
        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="mockDefinition">Mock definition to store in cache</param>
        public UpdateMockDefinitionByTitleCommand(MockDefinition mockDefinition)
        {
            this.MockDefinition = mockDefinition;
        }

        /// <summary>
        /// Mockdefinition property
        /// </summary>
        public MockDefinition MockDefinition { get; }
    }
}
