using MediatR;
using Orbital.Mock.Server.Models;
using System.Diagnostics.CodeAnalysis;

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
        /// <param name="databaseLock">The database lock</param>
        public UpdateMockDefinitionByTitleCommand(MockDefinition mockDefinition, ref object databaseLock)
        {
            this.MockDefinition = mockDefinition;
            this.databaseLock = databaseLock;
        }

        /// <summary>
        /// Mockdefinition property
        /// </summary>
        public MockDefinition MockDefinition { get; }

        /// <summary>
        /// The database lock
        /// </summary>
        public object databaseLock;
    }
}
