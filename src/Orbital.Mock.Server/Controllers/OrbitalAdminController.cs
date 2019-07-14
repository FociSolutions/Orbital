using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Orbital.Mock.Server.Cache;
using Orbital.Mock.Server.Commands;
using Orbital.Mock.Server.Filters;
using Orbital.Mock.Server.Models;
using System;
using System.Collections.Generic;

namespace Orbital.Mock.Server.Controllers
{
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    [ApiVersion("1.0")]
    [ModelValidation]
    public class OrbitalAdminController : ControllerBase
    {

        private readonly IMediator mediator;


        /// <summary>
        /// 
        /// </summary>
        /// <param name="cache"></param>
        public OrbitalAdminController(IMediator mediator)
        {
            this.mediator = mediator;
        }

        // GET api/values
        [HttpGet]
        public ActionResult<IEnumerable<string>> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/values/5
        [HttpGet("{id}")]
        public ActionResult<string> Get(string id)
        {
            var command = new GetMockDefinitionCommand(id);
            var result = this.mediator.Send(command).Result;
            return result;

        }

        // POST api/values
        [HttpPost]
        public IActionResult Post([FromBody]MockDefinition mockDefinition)
        {
            var command = new SaveMockDefinitionCommand(mockDefinition);
            this.mediator.Send(command);
            return Ok();

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

