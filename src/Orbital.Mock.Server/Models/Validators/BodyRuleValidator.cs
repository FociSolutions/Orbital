using FluentValidation;
using Orbital.Mock.Server.Models.Rules;

namespace Orbital.Mock.Server.Models.Validators
{
    /// <summary>
    /// Validator responsible for validating BodyRule objects
    /// </summary>
    public class BodyRuleValidator : AbstractValidator<BodyRule>
    {
        public BodyRuleValidator()
        {
            RuleFor(m => m.Type).NotNull();
            RuleFor(m => m.RuleValue).NotNull();
        }
    }
}
