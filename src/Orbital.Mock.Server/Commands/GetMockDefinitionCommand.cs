using MediatR;
using Orbital.Mock.Server.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Orbital.Mock.Server.Commands
{
    public class GetMockDefinitionCommand : IRequest<string>
    {
        public GetMockDefinitionCommand(string mockTitle)
        {
            this.MockDefinitionTitle = mockTitle;

        }

        public string MockDefinitionTitle { get; }
    }
}
