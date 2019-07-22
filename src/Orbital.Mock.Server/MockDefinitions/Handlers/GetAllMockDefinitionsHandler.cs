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
        private const string MOCKIDS = "mockids";

        private readonly IMemoryCache cache;

        /// <summary>
        /// Constructor
        /// </summary>
        public GetAllMockDefinitionsHandler(IMemoryCache cache)
        {
            this.cache = cache;
        }

        public Task<List<MockDefinition>> Handle(GetAllMockDefinitionsCommand request, CancellationToken cancellationToken)
        {
            List<MockDefinition> MockDefinitionsList = new List<MockDefinition>();
            cache.TryGetValue(MOCKIDS, out List<string> KeyList);

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




