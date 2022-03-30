using System;
using System.Runtime.CompilerServices;
using System.Threading;

[assembly: InternalsVisibleTo("Orbital.Mock.Server.Integration.Tests")]

namespace Orbital.Mock.Server.Pipelines.Models.Interfaces
{
    /// <summary>
    /// Interface for starting and stopping a pipeline
    /// </summary>
    internal interface IPipeline : IDisposable
    {
        /// <summary>
        /// Start the pipeline
        /// </summary>
        void Start();

        /// <summary>
        /// Stop the pipeline
        /// </summary>
        bool Stop();

        /// <summary>
        /// Access the variable that holds the status of the pipeline (running or not)
        /// </summary>
        /// <returns>True if the pipeline has started successfully and ready to accept requests</returns>
        bool GetPipelineStatus();
    }

    /// <summary>
    /// Interface for pipeline that will return a value after it is done processing
    /// </summary>
    /// <typeparam name="TIn">Type of input required by pipeline</typeparam>
    /// <typeparam name="TOut">Type of output from pipeline</typeparam>
    internal interface IPipeline<TIn, TOut> : IPipeline
    {
        /// <summary>
        /// Push input onto pipeline to start processing it
        /// </summary>
        /// <param name="input">Input to be processed by the pipeline</param>
        /// <param name="token"></param>
        /// <returns>Result from pipeline, if applicable</returns>
        TOut Push(TIn input, CancellationToken token);
    }

    /// <summary>
    /// Interface for pipeline with push functionality
    /// </summary>
    /// <typeparam name="T">Type of input required by pipeline</typeparam>
    internal interface IPipeline<T> : IPipeline
    {
        /// <summary>
        /// Push input onto pipeline to start processing it
        /// </summary>
        /// <param name="input">Input to be processed by the pipeline</param>
        void Push(T input);
    }
}
