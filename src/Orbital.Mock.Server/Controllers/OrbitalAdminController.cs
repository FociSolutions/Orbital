using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Orbital.Mock.Server.Cache;
using Orbital.Mock.Server.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Orbital.Mock.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrbitalAdminController : ControllerBase
    {
        private MemoryCache _cache;
        public static readonly string cacheKey = "todoKey";


        public OrbitalAdminController(OrbitalMemoryCache memoryCache)
        {
            _cache = memoryCache.Cache;
        }
        //GET api/orbitaladmin
        [HttpGet]
        public ActionResult<IEnumerable<string>> GetIt()
        {
            return new string[] { "value1", "value2" };
        }

        [HttpPost]
        public async Task<IActionResult> PublishMock([FromBody] MockService mock)

        {

            return Ok("TODO");
        }


        [HttpGet]
        public ActionResult<IEnumerable<string>> GetMock([FromQuery] string mockId)

        {

            return Ok("TODO");
        }


    }


}
