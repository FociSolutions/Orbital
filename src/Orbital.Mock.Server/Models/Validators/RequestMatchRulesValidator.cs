using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Orbital.Mock.Server.Models.Validators
{
    /// <summary>
    /// Validator responsible for validating RequestMatchRule objects
    /// </summary>
    public class RequestMatchRulesValidator : AbstractValidator<RequestMatchRules>
    {
        public RequestMatchRulesValidator()
        {
            RuleFor(x => x.HeaderRules).NotNull();
            RuleFor(x => x.QueryRules).NotNull();
            RuleFor(x => x.BodyRules).NotNull();
        }
    }
}
