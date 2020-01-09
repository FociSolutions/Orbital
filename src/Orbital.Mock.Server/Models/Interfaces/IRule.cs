namespace Orbital.Mock.Server.Models.Interfaces
{
    /// <summary>
    /// Interface to implement comparer types
    /// </summary>
    public interface IRule
    {
        ComparerType Type { get; set; }
    }

    /// <summary>
    /// Enum that indicates which comparer to use
    /// </summary>
    public enum ComparerType
    {
        Regex = 0,
        StartWith,
        EndWith,
        Equal,
        Contains
    };
}
