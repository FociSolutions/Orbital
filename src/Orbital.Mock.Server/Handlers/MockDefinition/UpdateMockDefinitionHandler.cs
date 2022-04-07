using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;

using Microsoft.Extensions.Caching.Memory;

using Orbital.Mock.Definition;
using Orbital.Mock.Server.MockDefinitions.Commands;

using MediatR;

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
            lock (request.databaseLock)
            {
                var cachedMockDefinition = cache.Get<MockDefinition>(request.MockDefinition.Metadata.Title);
                var mockDefExisted = cachedMockDefinition != null;
                var newMockDef = request.MockDefinition;

                cache.Set(newMockDef.Metadata.Title, newMockDef);
                var KeyList = cache.GetOrCreate(Constants.MOCK_IDS_CACHE_KEY, cacheEntry => { return new List<string>(); });

                if (!KeyList.Contains(newMockDef.Metadata.Title))
                {
                    KeyList.Add(newMockDef.Metadata.Title);
                    cache.Set(Constants.MOCK_IDS_CACHE_KEY, KeyList);
                }

                return Task.FromResult(mockDefExisted ? newMockDef : null);
            }
        }

    }
}
