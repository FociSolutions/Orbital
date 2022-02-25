using FluentValidation;

namespace Orbital.Mock.Definition.Validators
{
    /// <summary>
    /// Validator responsible for validating MetadataInfo objects
    /// </summary>
    public class MetadataValidator : AbstractValidator<Metadata>
    {
        public MetadataValidator()
        {
            RuleFor(x => x.Title).NotEmpty();
        }
    }
}
