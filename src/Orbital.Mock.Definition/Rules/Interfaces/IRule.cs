namespace Orbital.Mock.Definition.Rules.Interfaces
{
    /// <summary>
    /// Interface to be implemented by all the match rules
    /// </summary>
    public interface IRule
    {
        ComparerType Type { get; set; }
    }
}
