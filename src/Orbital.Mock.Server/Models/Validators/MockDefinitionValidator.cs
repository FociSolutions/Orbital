using FluentValidation;
using Microsoft.OpenApi.Validations;
using Microsoft.OpenApi.Validations.Rules;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Orbital.Mock.Server.Models.Validators
{
    /// <summary>
    /// 
    /// </summary>
    public class MockDefinitionValidator : AbstractValidator<MockDefinition>
    {        /// <summary>
             /// 
             /// </summary>
        public MockDefinitionValidator()
        {
            RuleFor(x => x.Host).NotEmpty();
            RuleFor(x => x.OpenApi).NotEmpty();
            RuleFor(x => x.BasePath).NotEmpty();
            RuleFor(x => ValidateOpenAPIDocument(x)).Equals(true);
            RuleFor(x => x.Metadata).InjectValidator();
        }

        private bool ValidateOpenAPIDocument(MockDefinition mockDefinition)
        {
            var openApiValidator = new OpenApiValidator(new ValidationRuleSet(ValidationRuleSet.GetDefaultRuleSet()));
            openApiValidator.Visit(mockDefinition.OpenApi);
            return openApiValidator.Errors.Count() == 0;
        }
    }
}
