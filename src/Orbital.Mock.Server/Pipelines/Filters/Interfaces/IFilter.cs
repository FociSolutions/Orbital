namespace Orbital.Mock.Server.Pipelines.Filters.Interfaces
{
    /// <summary>
    /// Filter receives messages on the inbound port, processes the message, then pass the message to outbound port
    /// </summary>
    /// <typeparam name="T">Type of the port</typeparam>
    internal interface IFilter<T>
    {
        /// <summary>
        /// Process data using content provided by given port
        /// </summary>
        /// <param name="port">The port containing necessary data</param>
        /// <returns>Port containing processed data</returns>
        T Process(T port);
    }
}
