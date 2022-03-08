using System;
namespace Orbital.Mock.Server.Services.Interfaces
{
    public interface IMockDefinitionImportService
    {
        /// <summary>
        /// Imports MockDefinitions from all supported sources and loads them into the MemoryCache.
        /// </summary>
        void ImportAllIntoMemoryCache();
    }
}
