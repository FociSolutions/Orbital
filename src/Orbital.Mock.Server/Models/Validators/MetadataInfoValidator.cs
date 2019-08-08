using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Orbital.Mock.Server.Models.Validators
{
    /// <summary>
    /// Validator responsible for validating MetadataInfo objects
    /// </summary>
    public class MetadataInfoValidator : AbstractValidator<MetadataInfo>
    {
        public MetadataInfoValidator()
        {
            RuleFor(x => x.Title).NotEmpty();
        }
    }
}
