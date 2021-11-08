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

    /// <summary>
    /// Handler for executing the InvokeSynchronousPipelineCommand
    /// </summary>

    [ExcludeFromCodeCoverage]
    internal class InvokeSynchronousPipelineHandler : IRequestHandler<InvokeSynchronousPipelineCommand, MockResponse>
    {

        private readonly IPipeline<MessageProcessorInput, Task<MockResponse>> mockServerProcessor;
        private readonly IMemoryCache cache;
        private string mockIds;

        public InvokeSynchronousPipelineHandler(IMemoryCache cache, IPipeline<MessageProcessorInput, Task<MockResponse>> mockServerProcessor, CommonData data)
        {
            this.mockServerProcessor = mockServerProcessor;
            this.cache = cache;
            this.mockIds = data.mockIds;
        }

        /// <inheritdoc />
        public Task<MockResponse> Handle(InvokeSynchronousPipelineCommand command, CancellationToken cancellationToken)
        {
            lock (command.databaseLock)
            {
                var idList = this.cache.GetOrCreate(mockIds, c => new List<string>());
                var mockDefinitions = idList.Select(id => this.cache.Get<MockDefinition>(id));

                var scenarios = mockDefinitions.SelectMany(mockDefinition => mockDefinition.Scenarios);
                var signingKeys = mockDefinitions.Where(md => md.TokenValidation.Validate)
                                                 .Select(mockDef => mockDef.TokenValidation.Key);

                var response = this.mockServerProcessor.Push(new MessageProcessorInput(command.Request, scenarios.ToList(), signingKeys.ToList()), cancellationToken).Result;
                return Task.FromResult(response);
            }
        }
    }
}
