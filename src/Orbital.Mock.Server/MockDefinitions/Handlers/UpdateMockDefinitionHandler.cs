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
    /// Class that handles incoming requests to update a mock definition
    /// </summary>
    public class UpdateMockDefinitionHandler : IRequestHandler<UpdateMockDefinitionByTitleCommand>
    {
        private readonly IMemoryCache cache;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="cache">Cache to update with mockdefinition</param>
        public UpdateMockDefinitionHandler(IMemoryCache cache)
        {
            this.cache = cache;
        }

        /// <summary>
        /// Asynchronously handles updating the mock definition to cache.
        /// </summary>
        /// <param name="request"></param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        public Task<Unit> Handle(UpdateMockDefinitionByTitleCommand request, CancellationToken cancellationToken)
        {
            this.cache.Set(request.MockDefinition.Metadata.Title, request.MockDefinition);
            return Unit.Task;
        }
    }
}
