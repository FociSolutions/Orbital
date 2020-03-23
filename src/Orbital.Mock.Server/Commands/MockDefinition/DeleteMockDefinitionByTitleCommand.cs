using MediatR;
using System.Diagnostics.CodeAnalysis;

namespace Orbital.Mock.Server.MockDefinitions.Commands
{
    /// <summary>
    /// Class DeleteMockDefinitionByTitleCommand represents a request to delete a mock definition from cache using its title
    /// </summary>

    [ExcludeFromCodeCoverage]
    public class DeleteMockDefinitionByTitleCommand : IRequest
    {
        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="mockDefinitionTitle">Title of mock definition to delete</param>
        public DeleteMockDefinitionByTitleCommand(string mockDefinitionTitle, ref object databaseLock)
        {
            MockDefinitionTitle = mockDefinitionTitle;
            this.databaseLock = databaseLock;
        }

        /// <summary>
        /// Mock Definition title property
        /// </summary>
        public string MockDefinitionTitle { get; }

        /// <summary>
        /// The database lock
        /// </summary>
        public object databaseLock;
    }
}
