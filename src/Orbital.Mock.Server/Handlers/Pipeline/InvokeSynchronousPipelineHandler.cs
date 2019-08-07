using MediatR;
using Microsoft.Extensions.Caching.Memory;
using Orbital.Mock.Server.Models;
using Orbital.Mock.Server.Pipelines.Commands;
using Orbital.Mock.Server.Pipelines.Models;
using Orbital.Mock.Server.Pipelines.Models.Interfaces;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Orbital.Mock.Server.Pipelines.Handlers
{
    [ExcludeFromCodeCoverage]

    /// <summary>
    /// Handler for executing the InvokeSynchronousPipelineCommand
    /// </summary>
    internal class InvokeSynchronousPipelineHandler : IRequestHandler<InvokeSynchronousPipelineCommand, MockResponse>
    {
        private const string MOCKIDS = "mockids";

        private readonly IPipeline<MessageProcessorInput, Task<MockResponse>> mockServerProcessor;
        private readonly IMemoryCache cache;

        public InvokeSynchronousPipelineHandler(IMemoryCache cache, IPipeline<MessageProcessorInput, Task<MockResponse>> mockServerProcessor)
        {
            this.mockServerProcessor = mockServerProcessor;
            this.cache = cache;
        }

        /// <summary>
        /// Invokes the synchronous pipeline and returns the resulting HttpResponse
        /// </summary>
        /// <param name="command"></param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        public Task<MockResponse> Handle(InvokeSynchronousPipelineCommand command, CancellationToken cancellationToken)
        {
            var idList = this.cache.GetOrCreate(MOCKIDS, c => new List<string>());
            var mockDefinitions = idList.Select(id => this.cache.Get<MockDefinition>(id));
            var scenarios = mockDefinitions.SelectMany(mockDefinition => mockDefinition.Scenarios);
            var response = this.mockServerProcessor.Push(new MessageProcessorInput(command.Request, scenarios.ToList())).Result;
            return Task.FromResult(response);
        }
    }
}
