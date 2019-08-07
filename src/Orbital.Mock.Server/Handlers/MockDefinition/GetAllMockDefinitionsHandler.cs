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
    /// Class GetAllMockDefinitionHandler handles all requests to retrieve all mock definitions
    /// </summary>
    public class GetAllMockDefinitionsHandler : IRequestHandler<GetAllMockDefinitionsCommand, List<MockDefinition>>
    {

        private readonly IMemoryCache cache;
        private readonly string mockIds;

        /// <summary>
        /// Constructor
        /// </summary>
        public GetAllMockDefinitionsHandler(IMemoryCache cache, CommonData data)
        {
            this.cache = cache;
            this.mockIds = data.mockIds;
        }

        public Task<List<MockDefinition>> Handle(GetAllMockDefinitionsCommand request, CancellationToken cancellationToken)
        {
            List<MockDefinition> MockDefinitionsList = new List<MockDefinition>();
            cache.TryGetValue(mockIds, out List<string> KeyList);

            if (KeyList == null)
            {
                return Task.FromResult(MockDefinitionsList);
            }

            foreach (var md in KeyList)
            {
                MockDefinitionsList.Add(cache.Get<MockDefinition>(md));
            }

            return Task.FromResult(MockDefinitionsList);
        }
    }
}




