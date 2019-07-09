using Microsoft.Extensions.Caching.Memory;

namespace Orbital.Mock.Server.Cache
{
    public class OrbitalMemoryCache
    {
        public MemoryCache Cache { get; set; }
        public OrbitalMemoryCache()
        {
            Cache = new MemoryCache(new MemoryCacheOptions
            {
                SizeLimit = 1024
            });
        }
    }
}



