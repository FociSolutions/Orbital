using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

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
            RuleFor(m => m.Rule).NotNull();
        }
    }
}
