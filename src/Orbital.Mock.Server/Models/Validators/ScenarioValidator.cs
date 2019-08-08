using FluentValidation;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Server.Kestrel.Core.Internal.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Orbital.Mock.Server.Models.Validators
{
    /// <summary>
    /// Validator responsible for validating Scenario objects
    /// </summary>
    public class ScenarioValidator : AbstractValidator<Scenario>
    {
        private List<HttpMethod> validMethod = new List<HttpMethod> { HttpMethod.Get, HttpMethod.Post, HttpMethod.Put, HttpMethod.Delete };
        public ScenarioValidator()
        {
            RuleFor(x => x.Id).NotEmpty();
            RuleFor(x => x.Response).NotEmpty();
            RuleFor(x => x.Metadata).InjectValidator();
            RuleFor(x => x.Verb).Must(verb => validMethod.Contains(verb));
            RuleFor(x => x.Path).NotNull();
        }

    }
}
