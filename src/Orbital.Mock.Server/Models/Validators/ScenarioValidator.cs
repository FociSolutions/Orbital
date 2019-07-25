using FluentValidation;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Orbital.Mock.Server.Models.Validators
{
    public class ScenarioValidator : AbstractValidator<Scenario>
    {
        public ScenarioValidator()
        {
            RuleFor(x => x.Id).NotEmpty();
            RuleFor(x => x.Response).NotEmpty();
            RuleFor(x => x.Metadata).InjectValidator();
            RuleFor(x => x.Verb).Must(verb =>
                 HttpMethods.IsGet(verb) ||
                 HttpMethods.IsPost(verb) ||
                 HttpMethods.IsPut(verb) ||
                 HttpMethods.IsDelete(verb));
            RuleFor(x => x.Path).NotNull();
        }

    }
}
