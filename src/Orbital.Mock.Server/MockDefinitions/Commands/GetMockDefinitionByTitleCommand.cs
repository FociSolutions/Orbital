using MediatR;
using Orbital.Mock.Server.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Orbital.Mock.Server.MockDefinitions.Commands
{
    public class GetMockDefinitionByTitleCommand : IRequest<MockDefinition>
    {
        public GetMockDefinitionByTitleCommand(string mockTitle)
        {
            this.MockDefinitionTitle = mockTitle;
        }

        public string MockDefinitionTitle { get; }
    }
}
