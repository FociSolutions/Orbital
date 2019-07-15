using FluentValidation;
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

        /// <summary>
        /// 
        /// </summary>
        public MockDefinitionValidator()
        {
            RuleFor(x => x.Host).NotEmpty();
            RuleFor(x => x.Metadata).InjectValidator();
        }
    }
}
