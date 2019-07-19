using MediatR;
using Microsoft.Extensions.Caching.Memory;
using Orbital.Mock.Server.MockDefinitions.Commands;
using Orbital.Mock.Server.Models;
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
    public class UpdateMockDefinitionHandler : IRequestHandler<UpdateMockDefinitionByTitleCommand, MockDefinition>
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
        public Task<MockDefinition> Handle(UpdateMockDefinitionByTitleCommand request, CancellationToken cancellationToken)
        {
            var mockDefinition = cache.Get<MockDefinition>(request.MockDefinition.Metadata.Title);
            cache.Set(request.MockDefinition.Metadata.Title, request.MockDefinition);
            return Task.FromResult(mockDefinition);
        }

    }
}
