using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Orbital.Mock.Server.MockDefinitions.Commands
{
    /// <summary>
    /// 
    /// </summary>
    public class DeleteMockDefinitionByTitleCommand : IRequest
    {
        /// <summary>
        /// 
        /// </summary>
        /// <param name="mockDefinitionTitle"></param>
        public DeleteMockDefinitionByTitleCommand(string mockDefinitionTitle)
        {
            MockDefinitionTitle = mockDefinitionTitle;
        }

        /// <summary>
        /// 
        /// </summary>
        public string MockDefinitionTitle { get; }
    }
}
