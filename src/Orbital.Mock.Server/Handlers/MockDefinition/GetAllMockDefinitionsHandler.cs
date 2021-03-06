﻿using MediatR;
using Microsoft.Extensions.Caching.Memory;
using Orbital.Mock.Server.MockDefinitions.Commands;
using Orbital.Mock.Server.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Orbital.Mock.Server.MockDefinitions.Handlers
{
    /// <summary>
    /// Class GetAllMockDefinitionHandler handles all requests to retrieve all mock definitions
    /// </summary>
    public class GetAllMockDefinitionsHandler : IRequestHandler<GetAllMockDefinitionsCommand, IEnumerable<MockDefinition>>
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

        public Task<IEnumerable<MockDefinition>> Handle(GetAllMockDefinitionsCommand request, CancellationToken cancellationToken)
        {
            lock (request.databaseLock)
            {
                cache.TryGetValue(mockIds, out List<string> KeyList);

                if (KeyList == null)
                {
                    return Task.FromResult(new List<MockDefinition>() as IEnumerable<MockDefinition>);
                }

                return Task.FromResult(KeyList.Select(id => cache.Get<MockDefinition>(id)));
            }
        }
    }
}




