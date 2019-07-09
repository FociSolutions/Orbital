using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace Orbital.Mock.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrbitalServerController : ControllerBase
    {
        // GET api/orbitalserver
        [HttpGet]
        public ActionResult<IEnumerable<string>> Get()
        {
            return new string[] { "value1", "value2" };
        }

     
    }
}
