using MediatR;
using Microsoft.Extensions.Caching.Memory;
using Orbital.Mock.Server.MockDefinitions.Commands;
using Orbital.Mock.Server.Models;
using System.Collections.Generic;
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
        private readonly string mockIds;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="cache">Cache to save the mock definition</param>
        public SaveMockDefinitionHandler(IMemoryCache cache, CommonData data)
        {
            this.cache = cache;
            this.mockIds = data.mockIds;
        }

        /// <summary>
        /// Asynchronously handles saving the mock definition to cache at the same time it passes an accessible id (title) List from the cache
        /// </summary>
        /// <param name="request">SaveMockDefinition command</param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        public Task<Unit> Handle(SaveMockDefinitionCommand request, CancellationToken cancellationToken)
        {
            lock (request.databaseLock)
            {
                this.cache.Set(request.MockDefinition.Metadata.Title, request.MockDefinition);
                var keysCollection = this.cache.GetOrCreate(mockIds, cacheEntry => { return new List<string>(); });

                if (!keysCollection.Contains(request.MockDefinition.Metadata.Title))
                {
                    keysCollection.Add(request.MockDefinition.Metadata.Title);
                    this.cache.Set(mockIds, keysCollection);
                }

                return Unit.Task;
            }
        }

    }
}
