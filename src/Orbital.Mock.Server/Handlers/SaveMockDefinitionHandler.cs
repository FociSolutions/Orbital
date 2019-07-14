using MediatR;
using Microsoft.Extensions.Caching.Memory;
using Orbital.Mock.Server.Commands;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Orbital.Mock.Server.Handlers
{

    public class SaveMockDefinitionHandler : IRequestHandler<SaveMockDefinitionCommand>
    {
        private readonly IMemoryCache cache;

        public SaveMockDefinitionHandler(IMemoryCache cache)
        {
            this.cache = cache;
        }

        public Task<Unit> Handle(SaveMockDefinitionCommand request, CancellationToken cancellationToken)
        {
            this.cache.Set(request.MockDefinition.Metadata.Title, request.MockDefinition);
            return Unit.Task;
        }
    }
}
