using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Newtonsoft.Json.Converters;
using Orbital.Mock.Server.Filters;
using Orbital.Mock.Server.MockDefinitions.Commands;
using Orbital.Mock.Server.Models;
using Serilog;
using Orbital.Mock.Server.Pipelines.Models.Examples;
using Swashbuckle.AspNetCore.Filters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;

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
        [SwaggerResponseExample((int)(HttpStatusCode.OK), typeof(MockDefinitionsModelExamples), jsonConverter: typeof(StringEnumConverter))]
        public ActionResult<MockDefinition> Get(string id)
        {
            var command = new GetMockDefinitionByTitleCommand(id);
            var result = this.mediator.Send(command).Result;
            Log.Information("OrbitalAdminController: Sent HTTPGet Command for MockDefinition on id: {Id}", id);
            return result;

        }

        /// <summary>
        /// Gets all Mock Definitions
        /// </summary>
        /// <returns>MockDefinition</returns>
        [HttpGet]
        [SwaggerResponseExample((int)(HttpStatusCode.OK), typeof(MockDefinitionsModelExamples), jsonConverter: typeof(StringEnumConverter))]
        public ActionResult<IEnumerable<MockDefinition>> GetAll()
        {
            var command = new GetAllMockDefinitionsCommand();
            var result = this.mediator.Send(command).Result;
            Log.Information("OrbitalAdminController: Sent HTTPGet Command for all MockDefinitions");
            return result.ToList();
        }

        /// <summary>
        /// Saves a mock defintiion in cache
        /// </summary>
        /// <param name="mockDefinition">The mock defiition to save</param>
        /// <returns>CreatedResult containing uri to the created resource</returns>

        [HttpPost]
        [SwaggerRequestExample(typeof(MockDefinition), typeof(MockDefinitionsModelExamples), jsonConverter: typeof(StringEnumConverter))]
        public IActionResult Post([FromBody]MockDefinition mockDefinition)
        {
            var command = new SaveMockDefinitionCommand(mockDefinition);
            this.mediator.Send(command).Wait();
            Log.Information("OrbitalAdminController: Sent HTTPPost Command to save Mockdefinition, {MockDefinition}", mockDefinition.Metadata.Title);
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
            Log.Information("OrbitalAdminController: Sent HTTPDelete Command to delete Mockdefinition on id: {Id}", id);
            return Ok();
        }

        /// <summary>
        /// Updates a mock definition in cache
        /// </summary>
        /// <param name="mockDefinition"></param>
        /// <returns></returns>
        [HttpPut]
        [SwaggerRequestExample(typeof(MockDefinition), typeof(MockDefinitionsModelExamples), jsonConverter: typeof(StringEnumConverter))]
        public IActionResult Put([FromBody]MockDefinition mockDefinition)
        {
            var command = new UpdateMockDefinitionByTitleCommand(mockDefinition);
            var result = mediator.Send(command).Result;
            if (result == null)
            {
                return Created(new Uri($"{Request.Path}/{mockDefinition.Metadata.Title}", UriKind.Relative), mockDefinition);
            }
            Log.Information("OrbitalAdminController: Sent HTTPut Command to update Mockdefinition, {MockDefinition}", mockDefinition.Metadata.Title);
            return Ok();
        }
    }
}

