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
    public class MetadataInfoValidator : AbstractValidator<MetadataInfo>
    {

        /// <summary>
        /// 
        /// </summary>
        public MetadataInfoValidator()
        {

                RuleFor(x => x.Title).NotEmpty();
                RuleFor(x => x.Description).NotNull();

        }
    }
}
