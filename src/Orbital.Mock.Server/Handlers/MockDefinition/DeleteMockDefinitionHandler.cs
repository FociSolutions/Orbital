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
    /// Class DeleteMockDefinitionHandler handles requests to delete a mock definition by its title
    /// </summary>
    public class DeleteMockDefinitionHandler : IRequestHandler<DeleteMockDefinitionByTitleCommand>
    {
        private readonly IMemoryCache cache;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="cache">Cache to delete mock definition from</param>
        public DeleteMockDefinitionHandler(IMemoryCache cache)
        {
            this.cache = cache;
        }
        /// <summary>
        /// Asynchronously deletes the mock definition from cache
        /// </summary>
        /// <param name="request">DeleteMockDefinitionByTitle command</param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        public Task<Unit> Handle(DeleteMockDefinitionByTitleCommand request, CancellationToken cancellationToken)
        {
            lock (request.databaseLock)
            {
                this.cache.Remove(request.MockDefinitionTitle);
                var KeyList = this.cache.GetOrCreate(CommonData.MockIds, cacheEntry => { return new List<string>(); });
                KeyList.Remove(request.MockDefinitionTitle);
                this.cache.Set(CommonData.MockIds, KeyList);
            }
            return Unit.Task;
        }

    }
}
