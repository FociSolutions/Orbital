using System.Threading;
using System.Threading.Tasks;

using Microsoft.Extensions.Caching.Memory;

using Orbital.Mock.Definition;
using Orbital.Mock.Server.MockDefinitions.Commands;

using MediatR;

namespace Orbital.Mock.Server.MockDefinitions.Handlers
{

    /// <summary>
    /// Class GetMockDefinitionByTitleHandler handles all requests to retrieve a mock definition using its title
    /// </summary>
    public class GetMockDefinitionByTitleHandler : IRequestHandler<GetMockDefinitionByTitleCommand, MockDefinition>
    {
        private readonly IMemoryCache cache;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="cache">Cache to retrieve mock definitions</param>
        public GetMockDefinitionByTitleHandler(IMemoryCache cache)
        {
            this.cache = cache;
        }

        /// <summary>
        /// Asynchronously handles incomming GetMockDefinitionByTitle commands
        /// </summary>
        /// <param name="request">in comming command</param>
        /// <param name="cancellationToken"></param>
        /// <returns>Task containing the retrieved mock definition</returns>
        public Task<MockDefinition> Handle(GetMockDefinitionByTitleCommand request, CancellationToken cancellationToken)
        {
            lock (request.databaseLock)
            {
                var mockDefinition = this.Handle(request.MockDefinitionTitle);
                return Task.FromResult(mockDefinition);
            }
        }

        /// <summary>
        /// Synchronously handles retrieving the mock definition from cache
        /// </summary>
        /// <param name="mockDefinitionTitle"></param>
        /// <returns>The mock definition</returns>
        public MockDefinition Handle(string mockDefinitionTitle)
        {
            this.cache.TryGetValue<MockDefinition>(mockDefinitionTitle, out var mockDefinition);

            if (mockDefinition == null)
            {
                return null;
            }

            return mockDefinition;
        }
    }
}
