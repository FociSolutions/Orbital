using System;

namespace Orbital.Mock.Server.Pipelines.Envelopes.Interfaces
{
    /// <summary>
    /// Interface for block envelope that help to pass headers through the pipeline
    /// </summary>
    /// <typeparam name="T">Type of the port</typeparam>
    internal interface IEnvelope<T>
    {
        /// <summary>
        /// Data stored in the current envelope
        /// </summary>
        T Data { get; }

        /// <summary>
        /// Change the data stored in the envelop while maintaining headers
        /// </summary>
        /// <param name="item">New port to store in the envelope</param>
        /// <returns>Envelope with the new port object</returns>
        IEnvelope<T> Transform(T item);

        /// <summary>
        /// Change the data stored in the envelop while maintaining headers
        /// </summary>
        /// <param name="func">Function that will return the new port</param>
        /// <returns>Envelope with the new port object</returns>
        IEnvelope<T> Transform(Func<T, T> func);
    }
}
