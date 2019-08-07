using MediatR;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Threading.Tasks;

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
        public DeleteMockDefinitionByTitleCommand(string mockDefinitionTitle)
        {
            MockDefinitionTitle = mockDefinitionTitle;
        }

        /// <summary>
        /// Mock Definition title property
        /// </summary>
        public string MockDefinitionTitle { get; }
    }
}
