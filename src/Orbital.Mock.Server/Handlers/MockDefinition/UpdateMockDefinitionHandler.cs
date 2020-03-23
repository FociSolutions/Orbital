using MediatR;
using Microsoft.Extensions.Caching.Memory;
using Orbital.Mock.Server.MockDefinitions.Commands;
using Orbital.Mock.Server.Models;
using System.Collections.Generic;
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
        private readonly string mockIds;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="cache">Cache to update with mockdefinition</param>
        public UpdateMockDefinitionHandler(IMemoryCache cache, CommonData data)
        {
            this.cache = cache;
            this.mockIds = data.mockIds;

        }

        /// <summary>
        /// Asynchronously handles updating the mock definition to cache.
        /// </summary>
        /// <param name="request"></param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        public Task<MockDefinition> Handle(UpdateMockDefinitionByTitleCommand request, CancellationToken cancellationToken)
        {
            lock (request.databaseLock)
            {
                var mockDefinition = cache.Get<MockDefinition>(request.MockDefinition.Metadata.Title);
                cache.Set(request.MockDefinition.Metadata.Title, request.MockDefinition);
                var KeyList = this.cache.GetOrCreate(mockIds, cacheEntry => { return new List<string>(); });
                if (!KeyList.Contains(request.MockDefinition.Metadata.Title))
                {
                    KeyList.Add(request.MockDefinition.Metadata.Title);
                    this.cache.Set(mockIds, KeyList);

                }
                return Task.FromResult(mockDefinition);
            }
        }

    }
}
