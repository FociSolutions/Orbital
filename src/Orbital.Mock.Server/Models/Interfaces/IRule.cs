namespace Orbital.Mock.Server.Models.Interfaces
{
    public interface IRule
    {
        ComparerType Type { get; }
    }

    public enum ComparerType
    {
        Regex = 0,
        StartWith,
        EndWith,
        Equal,
        Contains
    };
}
