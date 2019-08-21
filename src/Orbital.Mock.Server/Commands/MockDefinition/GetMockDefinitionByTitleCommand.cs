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
    /// Class MockDefinitionCommand represents a request for getting a mock definition based on its title
    /// </summary>

    [ExcludeFromCodeCoverage]
    public class GetMockDefinitionByTitleCommand : IRequest<MockDefinition>
    {
        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="mockTitle">Title of mock definition to get</param>
        public GetMockDefinitionByTitleCommand(string mockTitle)
        {
            this.MockDefinitionTitle = mockTitle;
        }

        /// <summary>
        /// Mock definition title
        /// </summary>
        public string MockDefinitionTitle { get; }
    }
}
