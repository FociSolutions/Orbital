using MediatR;
using Microsoft.Extensions.Caching.Memory;
using Orbital.Mock.Server.MockDefinitions.Commands;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Orbital.Mock.Server.Handlers
{
    /// <summary>
    /// Class SaveMockDefinitionHandler that handles incoming requests to save a mock definition
    /// </summary>
    public class SaveMockDefinitionHandler : IRequestHandler<SaveMockDefinitionCommand>
    {
        private readonly IMemoryCache cache;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="cache">Cache to save the mock definition</param>
        public SaveMockDefinitionHandler(IMemoryCache cache)
        {
            this.cache = cache;
        }

        /// <summary>
        /// Asynchronously handles saving the mock definition to cache.
        /// </summary>
        /// <param name="request">SaveMockDefinition command</param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        public Task<Unit> Handle(SaveMockDefinitionCommand request, CancellationToken cancellationToken)
        {
            this.cache.Set(request.MockDefinition.Metadata.Title, request.MockDefinition);
            return Unit.Task;
        }
    }
}
