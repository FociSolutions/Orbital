using Microsoft.Extensions.Caching.Memory;

namespace Orbital.Mock.Server.Services.Interfaces
{
    public interface IMockDefinitionImportService
    {
        /// <summary>
        /// Imports MockDefinitions from all supported sources and loads them into the MemoryCache.
        /// </summary>
        IMemoryCache ImportAllIntoMemoryCache();
    }
}
