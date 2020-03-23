using MediatR;
using Orbital.Mock.Server.Models;
using System.Diagnostics.CodeAnalysis;

namespace Orbital.Mock.Server.MockDefinitions.Commands
{
    /// <summary>
    /// Class MockDefinitionCommand represents a request for getting a mock definition based on its title
    /// </summary>

    [ExcludeFromCodeCoverage]
    public class GetMockDefinitionByTitleCommand : IRequest<MockDefinition>
    {
        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="mockTitle">Title of mock definition to get</param>
        public GetMockDefinitionByTitleCommand(string mockTitle, ref object databaseLock)
        {
            this.MockDefinitionTitle = mockTitle;
            this.databaseLock = databaseLock;
        }

        /// <summary>
        /// Mock definition title
        /// </summary>
        public string MockDefinitionTitle { get; }

        /// <summary>
        /// The database lock
        /// </summary>
        public object databaseLock;
    }
}
