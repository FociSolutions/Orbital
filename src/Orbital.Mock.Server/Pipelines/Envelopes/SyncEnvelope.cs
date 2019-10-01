using Orbital.Mock.Server.Pipelines.Envelopes.Interfaces;
using Orbital.Mock.Server.Pipelines.Ports;
using System;
using System.Diagnostics.CodeAnalysis;
using System.Threading;
using System.Threading.Tasks;

namespace Orbital.Mock.Server.Pipelines.Envelopes
{
    [ExcludeFromCodeCoverage]
    internal class SyncEnvelope : IEnvelope<ProcessMessagePort>
    {
        private readonly CancellationToken token;

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
        /// <param name="token"></param>
        public SyncEnvelope(TaskCompletionSource<ProcessMessagePort> completionSource, ProcessMessagePort data, CancellationToken token)
        {
            CompletionSource = completionSource;
            Data = data;
            this.token = token;

            this.token.Register(() =>
            {
                if (!this.CompletionSource.Task.IsCompleted) this.CompletionSource.SetResult(null);
            });
        }

        /// <inheritdoc />
        public IEnvelope<ProcessMessagePort> Transform(ProcessMessagePort item)
        {
            return new SyncEnvelope(CompletionSource, item, this.token);
        }

        /// <inheritdoc />
        public IEnvelope<ProcessMessagePort> Transform(Func<ProcessMessagePort, ProcessMessagePort> func)
        {
            return new SyncEnvelope(CompletionSource, func.Invoke(Data), this.token);
        }
    }
}
