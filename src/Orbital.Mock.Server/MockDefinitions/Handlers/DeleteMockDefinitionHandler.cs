using MediatR;
using Microsoft.Extensions.Caching.Memory;
using Orbital.Mock.Server.MockDefinitions.Commands;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Orbital.Mock.Server.MockDefinitions.Handlers
{
    /// <summary>
    /// 
    /// </summary>
    public class DeleteMockDefinitionHandler : IRequestHandler<DeleteMockDefinitionByTitleCommand>
    {
        private readonly IMemoryCache cache;
        /// <summary>
        /// 
        /// </summary>
        /// <param name="cache"></param>
        public DeleteMockDefinitionHandler(IMemoryCache cache)
        {
            this.cache = cache;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="request"></param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        public Task<Unit> Handle(DeleteMockDefinitionByTitleCommand request, CancellationToken cancellationToken)
        {
            this.cache.Remove(request.MockDefinitionTitle);
            return Unit.Task;
        }

    }
}
