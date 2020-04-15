using FluentValidation;
using Microsoft.AspNetCore.Server.Kestrel.Core.Internal.Http;
using System.Collections.Generic;

namespace Orbital.Mock.Server.Models.Validators
{
    /// <summary>
    /// Validator responsible for validating Scenario objects
    /// </summary>
    public class ScenarioValidator : AbstractValidator<Scenario>
    {
        private List<HttpMethod> validMethod = new List<HttpMethod> { HttpMethod.Get, HttpMethod.Post, HttpMethod.Put, HttpMethod.Delete, HttpMethod.Head, HttpMethod.Options, HttpMethod.Patch};
        public ScenarioValidator()
        {
            RuleFor(x => x.Id).NotEmpty();
            RuleFor(x => x.Response).NotEmpty();
            RuleFor(x => x.Metadata).InjectValidator();
            RuleFor(x => x.Verb).Must(verb => validMethod.Contains(verb));
            RuleFor(x => x.Path).NotNull();
            When(x => x.Response != null, () =>
            {
                RuleFor(x => x.Response.Type).NotEqual(ResponseType.NONE);
            });
        }

    }
}
