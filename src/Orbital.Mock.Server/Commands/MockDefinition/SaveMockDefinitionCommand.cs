using System.Diagnostics.CodeAnalysis;

using Orbital.Mock.Definition;

using MediatR;

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
        /// <param name="databaseLock">The database lock</param>
        public SaveMockDefinitionCommand(MockDefinition mockDefinition, ref object databaseLock)
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
