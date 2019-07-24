using Orbital.Mock.Server.Pipelines.Envelopes.Interfaces;
using System;
using System.Diagnostics.CodeAnalysis;
using System.Threading.Tasks.Dataflow;

namespace Orbital.Mock.Server.Pipelines.Factories.Bases
{
    [ExcludeFromCodeCoverage]
    internal abstract class BaseBlockFactory<T>
    {
        /// <summary>
        /// Create BroadcastBlock that broadcast T
        /// </summary>
        /// <param name="func">Function which this block is going to invoke</param>
        /// <returns>BroadcastBlock which the input is wrapped around by IEnvelope</returns>
        internal BroadcastBlock<IEnvelope<T>> CreateBroadcastBlock(Func<T, T> func)
        {
            return new BroadcastBlock<IEnvelope<T>>(envelope => envelope.Transform(func));
        }

        /// <summary>
        /// Create TransformBlock that take in T and returns T
        /// </summary>
        /// <param name="func">Function which this block is going to invoke</param>
        /// <returns>TransformBlock which the input and output are wrapped around by IEnvelope</returns>
        internal TransformBlock<IEnvelope<T>, IEnvelope<T>> CreateTransformBlock(Func<T, T> func)
        {
            return new TransformBlock<IEnvelope<T>, IEnvelope<T>>(envelope => envelope.Transform(func));
        }

        /// <summary>
        /// Create JoinBlock that take in T1 and T2
        /// </summary>
        /// <param name="options">Dataflow options for this block</param>
        /// <returns>JoinBlock which the inputs are wrapped around by IEnvelope</returns>
        internal JoinBlock<IEnvelope<T>, IEnvelope<T>> CreateJoinTwoBlock(GroupingDataflowBlockOptions options)
        {
            if (options == null)
            {
                options = new GroupingDataflowBlockOptions();
            }

            return new JoinBlock<IEnvelope<T>, IEnvelope<T>>(options);
        }

        /// <summary>
        /// Create TransformBlock that take in Tuple of T and T, then returns T
        /// </summary>
        /// <param name="func">Function which this block is going to invoke</param>
        /// <returns>TransformBlock which the input and output are wrapped around by IEnvelope</returns>
        internal abstract TransformBlock<Tuple<IEnvelope<T>, IEnvelope<T>>, IEnvelope<T>> CreateJoinTransformBlock(Func<Tuple<T, T>, T> func);

        /// <summary>
        /// Create JoinBlock that take in T1, T2, and T3
        /// </summary>
        /// <param name="options">Dataflow options for this block</param>
        /// <returns>JoinBlock which the inputs are wrapped around by IEnvelope</returns>
        internal JoinBlock<IEnvelope<T>, IEnvelope<T>, IEnvelope<T>> CreateJoinThreeBlock(GroupingDataflowBlockOptions options)
        {
            if (options == null)
            {
                options = new GroupingDataflowBlockOptions();
            }

            return new JoinBlock<IEnvelope<T>, IEnvelope<T>, IEnvelope<T>>(options);
        }

        /// <summary>
        /// Create TransformBlock that take in Tuple of T, T , and T; then returns T
        /// </summary>
        /// <param name="func">Function which this block is going to invoke</param>
        /// <returns>TransformBlock which the input and output are wrapped around by IEnvelope</returns>
        internal abstract TransformBlock<Tuple<IEnvelope<T>, IEnvelope<T>, IEnvelope<T>>, IEnvelope<T>> CreateJoinTransformBlock(Func<Tuple<T, T, T>, T> func);

        /// <summary>
        /// Create ActionBlock that invoke the given action
        /// </summary>
        /// <param name="action">The action to be invoked by the block</param>
        /// <returns>ActionBlock that will invoke the given action</returns>
        protected ActionBlock<IEnvelope<T>> CreateActionBlock(Action<IEnvelope<T>> action)
        {
            return new ActionBlock<IEnvelope<T>>(action);
        }
    }
}
