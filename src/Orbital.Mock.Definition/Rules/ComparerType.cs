namespace Orbital.Mock.Definition
{
    /// <summary>
    /// Enum that indicates the type of comparison being made
    /// </summary>
    public enum ComparerType
    {
        NONE = 0,
        REGEX,
        TEXTSTARTSWITH,
        TEXTENDSWITH,
        TEXTCONTAINS,
        TEXTEQUALS,
        JSONPATH,
        JSONEQUALITY,
        JSONCONTAINS,
        JSONSCHEMA,
        ACCEPTALL
    };
}
