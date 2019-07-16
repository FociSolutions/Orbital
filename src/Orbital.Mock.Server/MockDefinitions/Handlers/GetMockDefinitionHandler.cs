using MediatR;
using Microsoft.Extensions.Caching.Memory;
using Orbital.Mock.Server.MockDefinitions.Commands;
using Orbital.Mock.Server.Models;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Orbital.Mock.Server.MockDefinitions.Handlers
{

    public class GetMockDefinitionByTitleHandler : IRequestHandler<GetMockDefinitionByTitleCommand, MockDefinition>
    {
        private readonly IMemoryCache cache;

        public GetMockDefinitionByTitleHandler(IMemoryCache cache)
        {
            this.cache = cache;
        }

        public Task<MockDefinition> Handle(GetMockDefinitionByTitleCommand request, CancellationToken cancellationToken)
        {
            var mockDefinition = this.Handle(request.MockDefinitionTitle);
            return Task.FromResult(mockDefinition);
        }

        public MockDefinition Handle(string mockDefinitionTitle)
        {
            this.cache.TryGetValue<MockDefinition>(mockDefinitionTitle, out var mockDefinition);

            if(mockDefinition == null)
            {
                return null;
            }

            return mockDefinition;
        }

        internal object Handle(GetMockDefinitionByTitleCommand getMockDefinitionCommand, object none)
        {
            throw new NotImplementedException();
        }
    }
}
