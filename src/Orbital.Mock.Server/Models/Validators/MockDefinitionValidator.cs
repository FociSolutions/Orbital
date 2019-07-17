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
    {
        private OpenApiValidator openApiValidator;

        /// <summary>
        /// 
        /// </summary>
        public MockDefinitionValidator()
        {
            this.openApiValidator = new OpenApiValidator(new ValidationRuleSet(ValidationRuleSet.GetDefaultRuleSet()));
            RuleFor(x => x.Host).NotEmpty();
            RuleFor(x => x.OpenApi).NotEmpty();
            RuleFor(x => x.BasePath).NotEmpty();
            RuleFor(x => helper(x)).Empty();
            RuleFor(x => x.Metadata).InjectValidator();
        }

        private IEnumerable<OpenApiValidatorError> helper(MockDefinition x)
        {
            openApiValidator.Visit(x.OpenApi);
            return openApiValidator.Errors;
        }
    }
}
