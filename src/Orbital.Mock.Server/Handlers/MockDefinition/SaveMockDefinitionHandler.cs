using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;

using Microsoft.Extensions.Caching.Memory;

using Orbital.Mock.Definition;
using Orbital.Mock.Server.MockDefinitions.Commands;

using MediatR;

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
                var keysCollection = this.cache.GetOrCreate(CommonData.MockIds, cacheEntry => { return new List<string>(); });

                if (!keysCollection.Contains(request.MockDefinition.Metadata.Title))
                {
                    keysCollection.Add(request.MockDefinition.Metadata.Title);
                    this.cache.Set(CommonData.MockIds, keysCollection);
                }

                return Unit.Task;
            }
        }

    }
}
