using System.Net.Http;
using System.Collections.Generic;

using FluentValidation;

using Orbital.Mock.Definition.Response;

namespace Orbital.Mock.Definition.Validators
{
    /// <summary>
    /// Validator responsible for validating Scenario objects
    /// </summary>
    public class ScenarioValidator : AbstractValidator<Scenario>
    {
        private static readonly HashSet<HttpMethod> ValidMethods = new HashSet<HttpMethod> { HttpMethod.Get, HttpMethod.Post, HttpMethod.Put, HttpMethod.Delete, HttpMethod.Head, HttpMethod.Options, HttpMethod.Patch};
        public ScenarioValidator()
        {
            RuleFor(x => x.Id).NotEmpty();
            RuleFor(x => x.Response).NotEmpty();
            RuleFor(x => x.Metadata).InjectValidator();
            RuleFor(x => x.Verb).Must(verb => ValidMethods.Contains(verb));
            RuleFor(x => x.Path).NotNull();
            When(x => x.Response != null, () =>
            {
                RuleFor(x => x.Response.Type).NotEqual(MockResponseType.NONE);
            });
        }

    }
}
