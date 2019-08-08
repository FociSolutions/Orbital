using Orbital.Mock.Server.Pipelines.Envelopes.Interfaces;
using Orbital.Mock.Server.Pipelines.Ports;
using System;
using System.Diagnostics.CodeAnalysis;
using System.Threading.Tasks;

namespace Orbital.Mock.Server.Pipelines.Envelopes
{
    [ExcludeFromCodeCoverage]
    internal class SyncEnvelope : IEnvelope<ProcessMessagePort>
    {
        /// <summary>
        /// The TaskCompletionSource that will be pass on the very end of the pipeline
        /// </summary>
        internal TaskCompletionSource<ProcessMessagePort> CompletionSource { get; }

        /// <inheritdoc />
        public ProcessMessagePort Data { get; }

        /// <summary>
        /// Default constructor to take in task completion source and the data
        /// </summary>
        /// <param name="completionSource">TaskCompletionSource that will be pass on the very end of the pipeline</param>
        /// <param name="data">Data stored in the current envelope</param>
        public SyncEnvelope(TaskCompletionSource<ProcessMessagePort> completionSource, ProcessMessagePort data)
        {
            CompletionSource = completionSource;
            Data = data;
        }

        /// <inheritdoc />
        public IEnvelope<ProcessMessagePort> Transform(ProcessMessagePort item)
        {
            return new SyncEnvelope(CompletionSource, item);
        }

        /// <inheritdoc />
        public IEnvelope<ProcessMessagePort> Transform(Func<ProcessMessagePort, ProcessMessagePort> func)
        {
            return new SyncEnvelope(CompletionSource, func.Invoke(Data));
        }
    }
}
