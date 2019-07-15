using MediatR;
using Orbital.Mock.Server.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Orbital.Mock.Server.MockDefinitions.Commands
{
    public class SaveMockDefinitionCommand: IRequest
    {
        public SaveMockDefinitionCommand(MockDefinition mockDefinition)
        {
            this.MockDefinition = mockDefinition;
        }

        public MockDefinition MockDefinition { get; }
    }
}
