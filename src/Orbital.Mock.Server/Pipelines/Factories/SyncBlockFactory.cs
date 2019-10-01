using Orbital.Mock.Server.Pipelines.Envelopes;
using Orbital.Mock.Server.Pipelines.Envelopes.Interfaces;
using Orbital.Mock.Server.Pipelines.Factories.Bases;
using Orbital.Mock.Server.Pipelines.Ports;
using System;
using System.Diagnostics.CodeAnalysis;
using System.Threading;
using System.Threading.Tasks.Dataflow;

namespace Orbital.Mock.Server.Pipelines.Factories
{
    [ExcludeFromCodeCoverage]
    internal class SyncBlockFactory : BaseBlockFactory<ProcessMessagePort>
    {
        public SyncBlockFactory() : base()
        {
        }

        public SyncBlockFactory(CancellationTokenSource cancellationTokenSource) : base(cancellationTokenSource)
        {
            this.CancellationTokenSource = cancellationTokenSource;
        }

        /// <inheritdoc />
        internal override TransformBlock<Tuple<IEnvelope<ProcessMessagePort>, IEnvelope<ProcessMessagePort>>, IEnvelope<ProcessMessagePort>> CreateJoinTransformBlock(Func<Tuple<ProcessMessagePort, ProcessMessagePort>, ProcessMessagePort> func, CancellationTokenSource cancellationTokenSource)
        {
            return new TransformBlock<Tuple<IEnvelope<ProcessMessagePort>, IEnvelope<ProcessMessagePort>>, IEnvelope<ProcessMessagePort>>(envelopes =>
            {
                var envelope1 = (SyncEnvelope)envelopes.Item1;
                var envelope2 = (SyncEnvelope)envelopes.Item2;

                var result = func.Invoke(Tuple.Create(envelope1.Data, envelope2.Data));

                var envelope = (envelope1.CompletionSource != null) ? envelope1 : envelope2;
                return envelope.Transform(result);
            }, new ExecutionDataflowBlockOptions()
            {
                CancellationToken = this.CancellationTokenSource.Token
            });
        }

        /// <inheritdoc />
        internal override TransformBlock<Tuple<IEnvelope<ProcessMessagePort>, IEnvelope<ProcessMessagePort>, IEnvelope<ProcessMessagePort>>, IEnvelope<ProcessMessagePort>> CreateJoinTransformBlock(Func<Tuple<ProcessMessagePort, ProcessMessagePort, ProcessMessagePort>, ProcessMessagePort> func, CancellationTokenSource cancellationTokenSource)
        {
            return new TransformBlock<Tuple<IEnvelope<ProcessMessagePort>, IEnvelope<ProcessMessagePort>, IEnvelope<ProcessMessagePort>>, IEnvelope<ProcessMessagePort>>(envelopes =>
            {
                var envelope1 = (SyncEnvelope)envelopes.Item1;
                var envelope2 = (SyncEnvelope)envelopes.Item2;
                var envelope3 = (SyncEnvelope)envelopes.Item3;

                var result = func.Invoke(Tuple.Create(envelope1.Data, envelope2.Data, envelope3.Data));

                var envelope = (envelope1.CompletionSource != null) ? envelope1
                : ((envelope2.CompletionSource != null) ? envelope2 : envelope3);
                return envelope.Transform(result);
            }, new ExecutionDataflowBlockOptions()
            {
                CancellationToken = this.CancellationTokenSource.Token
            });
        }

        /// <summary>
        /// Create ActionBlock that will set the result for TaskCompletionSource, aka, letting the caller know all the work is done
        /// </summary>
        /// <returns>ActionBlock that sets the result for TaskCompletionSource</returns>
        internal ActionBlock<IEnvelope<ProcessMessagePort>> CreateFinalBlock(CancellationTokenSource cancellationTokenSource)
        {
            return CreateActionBlock(envelope =>
            {
                if (!((SyncEnvelope) envelope).CompletionSource.Task.IsCanceled && !((SyncEnvelope)envelope).CompletionSource.Task.IsCompleted)
                {
                    ((SyncEnvelope) envelope).CompletionSource.SetResult(envelope.Data);
                }
            }, cancellationTokenSource);
        }
    }
}