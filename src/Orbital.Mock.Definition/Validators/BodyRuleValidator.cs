using FluentValidation;

using Orbital.Mock.Definition.Rules;

namespace Orbital.Mock.Definition.Validators
{
    /// <summary>
    /// Validator responsible for validating BodyRule objects
    /// </summary>
    public class BodyRuleValidator : AbstractValidator<BodyRule>
    {
        public BodyRuleValidator()
        {
            RuleFor(m => m.Type).NotNull();
            RuleFor(m => m.Value).NotNull();
        }
    }
}
