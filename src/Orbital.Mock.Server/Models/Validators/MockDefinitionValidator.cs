using FluentValidation;
using FluentValidation.Validators;
using Microsoft.OpenApi.Models;
using Microsoft.OpenApi.Validations;
using Microsoft.OpenApi.Validations.Rules;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Orbital.Mock.Server.Models.Validators
{
    /// <summary>
    /// Validator responsible for validating MockDefinition objects
    /// </summary>
    public class MockDefinitionValidator : AbstractValidator<MockDefinition>
    {
        public MockDefinitionValidator()
        {
            RuleFor(x => x.Host).NotEmpty();
            RuleFor(x => x.OpenApi).NotEmpty();
            RuleFor(x => x.BasePath).NotEmpty();
            RuleFor(x => x.Scenarios).NotNull();
            RuleForEach(x => x.Scenarios).InjectValidator();
            RuleFor(x => x.OpenApi).Custom(IsValidOpenAPIDocument);
            RuleFor(x => x.Metadata).InjectValidator();
        }

        /// <summary>
        /// Runs the OpenApiValidator against the OpenApiDocument object. Returns true if the document is valid, false otherwise
        /// </summary>
        /// <param name="doc">The OpenApiDocument to test against</param>
        /// <param name="context"></param>
        /// <returns></returns>
        private void IsValidOpenAPIDocument(OpenApiDocument doc, CustomContext context)
        {
            var openApiValidator = new OpenApiValidator(ValidationRuleSet.GetDefaultRuleSet());
            openApiValidator.Visit(doc);
            foreach (var error in openApiValidator.Errors)
            {
                context.AddFailure(error.Message);
            }
        }
    }
}
