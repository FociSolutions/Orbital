using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Orbital.Mock.Server.Models.Validators
{
    public class TokenValidationValidator: AbstractValidator<TokenValidationInfo>
    {
        public TokenValidationValidator()
        {
            When(x => x.Validate != false, () =>
            {
                RuleFor(x => x.Key).NotNull();
                RuleFor(x => x.Key).Matches(@"^\S*$");
            });
        }
    }
}
