namespace Orbital.Mock.Server.Models.Interfaces
{
    /// <summary>
    /// Interface to be implemented by all the policies
    /// </summary>
    interface IPolicy
    {
        PolicyType Type { get; set; }
    }

    /// <summary>
    /// Enum that indicates which policy to use
    /// </summary>
    public enum PolicyType
    {
        NONE = 0,
        DELAYRESPONSE
    };
}
