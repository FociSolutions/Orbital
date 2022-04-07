using FluentValidation;

namespace Orbital.Mock.Definition.Validators
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
