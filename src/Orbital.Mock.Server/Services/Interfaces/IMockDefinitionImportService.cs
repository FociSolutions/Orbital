using Microsoft.Extensions.Caching.Memory;
using Orbital.Mock.Definition;

namespace Orbital.Mock.Server.Services.Interfaces
{
    public interface IMockDefinitionImportService
    {
        /// <summary>
        /// Imports MockDefinitions from all supported sources and loads them into the MemoryCache.
        /// </summary>
        IMemoryCache ImportAllIntoMemoryCache();

        /// <summary>
        /// Loads the given MockDefinition into the memory cache
        /// </summary>
        /// <param name="mockDefinition"></param>
        IMemoryCache AddMockDefToMemoryCache(MockDefinition mockDefinition);
    }
}
