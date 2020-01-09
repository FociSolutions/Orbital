namespace Orbital.Mock.Server.Models.Interfaces
{
    /// <summary>
    /// Interface to be implemented by all the match rules
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
