namespace Orbital.Mock.Definition.Interfaces
{
    /// <summary>
    /// Interface to be implemented by all the policies
    /// </summary>
    public interface IPolicy
    {
        PolicyType Type { get; set; }
    }
}
