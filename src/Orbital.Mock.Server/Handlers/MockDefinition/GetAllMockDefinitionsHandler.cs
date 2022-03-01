using System.Linq;
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
    /// Class GetAllMockDefinitionHandler handles all requests to retrieve all mock definitions
    /// </summary>
    public class GetAllMockDefinitionsHandler : IRequestHandler<GetAllMockDefinitionsCommand, IEnumerable<MockDefinition>>
    {
        private readonly IMemoryCache cache;

        /// <summary>
        /// Constructor
        /// </summary>
        public GetAllMockDefinitionsHandler(IMemoryCache cache)
        {
            this.cache = cache;
        }

        public Task<IEnumerable<MockDefinition>> Handle(GetAllMockDefinitionsCommand request, CancellationToken cancellationToken)
        {
            lock (request.databaseLock)
            {
                cache.TryGetValue(Constants.MOCK_IDS_CACHE_KEY, out List<string> KeyList);

                if (KeyList == null) { return Task.FromResult(new List<MockDefinition>() as IEnumerable<MockDefinition>); }

                return Task.FromResult(KeyList.Select(id => cache.Get<MockDefinition>(id)));
            }
        }
    }
}




