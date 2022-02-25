using FluentValidation;

using Orbital.Mock.Definition.Rules;

namespace Orbital.Mock.Definition.Validators
{
    /// <summary>
    /// Validator responsible for validating RequestMatchRule objects
    /// </summary>
    public class RequestMatchRulesValidator : AbstractValidator<RequestMatchRules>
    {
        public RequestMatchRulesValidator()
        {
            RuleFor(x => x.UrlRules).NotNull();
            RuleFor(x => x.HeaderRules).NotNull();
            RuleFor(x => x.QueryRules).NotNull();
            RuleFor(x => x.BodyRules).NotNull();
        }
    }
}
