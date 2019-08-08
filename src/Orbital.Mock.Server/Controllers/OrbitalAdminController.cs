using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Orbital.Mock.Server.Filters;
using Orbital.Mock.Server.MockDefinitions.Commands;
using Orbital.Mock.Server.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Orbital.Mock.Server.Controllers
{
    /// <summary>
    /// Controller for any administrative operations that orbital needs.
    /// </summary>
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    [ApiVersion("1.0")]
    [ModelValidation]
    public class OrbitalAdminController : ControllerBase
    {
        private readonly IMediator mediator;

        /// <summary>
        /// Default Constructor
        /// </summary>
        /// <param name="mediator">DI Mediator service used to send commands to appropriate handlers</param>
        public OrbitalAdminController(IMediator mediator)
        {
            this.mediator = mediator;
        }

        /// <summary>
        /// Gets the Mock Definition by the MockDefinition title
        /// </summary>
        /// <param name="id"> The mock definition title</param>
        /// <returns>MockDefinition</returns>
        [HttpGet("{id}")]
        public ActionResult<MockDefinition> Get(string id)
        {
            var command = new GetMockDefinitionByTitleCommand(id);
            var result = this.mediator.Send(command).Result;
            return result;

        }

        /// <summary>
        /// Gets all Mock Definitions
        /// </summary>
        /// <returns>MockDefinition</returns>
        [HttpGet]
        public ActionResult<IEnumerable<MockDefinition>> GetAll()
        {
            var command = new GetAllMockDefinitionsCommand();
            var result = this.mediator.Send(command).Result;
            return result.ToList();

        }

        /// <summary>
        /// Saves a mock defintiion in cache
        /// </summary>
        /// <param name="mockDefinition">The mock defiition to save</param>
        /// <returns>CreatedResult containing uri to the created resource</returns>
        [HttpPost]
        public IActionResult Post([FromBody]MockDefinition mockDefinition)
        {
            var command = new SaveMockDefinitionCommand(mockDefinition);
            this.mediator.Send(command).Wait();
            return Created(new Uri($"{Request.Path}/{mockDefinition.Metadata.Title}", UriKind.Relative), mockDefinition);
        }

        /// <summary>
        /// Deletes a mock definition in cache
        /// </summary>
        /// <param name="id">The mock definition to delete</param>
        /// <returns></returns>
        [HttpDelete("{id}")]
        public IActionResult Delete(string id)
        {
            var command = new DeleteMockDefinitionByTitleCommand(id);
            this.mediator.Send(command).Wait();
            return Ok();
        }

        /// <summary>
        /// Updates a mock definition in cache
        /// </summary>
        /// <param name="mockDefinition"></param>
        /// <returns></returns>
        [HttpPut]
        public IActionResult Put([FromBody]MockDefinition mockDefinition)
        {
            var command = new UpdateMockDefinitionByTitleCommand(mockDefinition);
            var result = mediator.Send(command).Result;
            if (result == null)
            {
                return Created(new Uri($"{Request.Path}/{mockDefinition.Metadata.Title}", UriKind.Relative), mockDefinition);
            }
            return Ok();
        }
    }
}

