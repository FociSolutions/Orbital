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

    public class GetMockDefinitionHandler : IRequestHandler<GetMockDefinitionCommand,string>
    {
        private readonly IMemoryCache cache;

        public GetMockDefinitionHandler(IMemoryCache cache)
        {
            this.cache = cache;
        }

        public Task<string> Handle(GetMockDefinitionCommand request, CancellationToken cancellationToken)
        {
            return Task.FromResult(this.cache.Get(request.MockDefinitionTitle).ToString());
                
          
        }
    }
}
