using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Orbital.Mock.Server.Cache;
using System.Collections.Generic;

namespace Orbital.Mock.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrbitalServerController : ControllerBase
    {

        private MemoryCache _cache;
        public static readonly string cacheKey = "todoKey";


        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="memoryCache"></param>
        public OrbitalServerController(OrbitalMemoryCache memoryCache)
        {
            _cache = memoryCache.Cache;
        }

        // GET api/values
        [HttpGet]
        public ActionResult<IEnumerable<string>> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/values/5
        [HttpGet("{id}")]
        public ActionResult<string> Get(int id)
        {
            return "value";
        }

        // POST api/values
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT api/values/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}

