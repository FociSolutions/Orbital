using Orbital.Mock.Definition;
using Orbital.Mock.Definition.Validators;

using Xunit;
using Bogus;
using FluentValidation.TestHelper;

namespace Orbital.Mock.Definition.Tests.Validators
{
    public class MetadataInfoValidatorTests
    {
        private Faker<MetadataInfo> metadataInfoFake;

        public MetadataInfoValidatorTests()
        {
            this.metadataInfoFake = new Faker<MetadataInfo>()
                .RuleFor(m => m.Description, f => f.Lorem.Paragraph())
                .RuleFor(m => m.Title, f => f.Lorem.Sentence());
        }
        [Fact]
        public void MetadataInfoValidatorSuccessTest()
        {
            var input = new
            {
                metadataInfo = metadataInfoFake.Generate()
            };

            var Target = new MetadataInfoValidator();

            Target.ShouldNotHaveValidationErrorFor(m => m.Description, input.metadataInfo);
            Target.ShouldNotHaveValidationErrorFor(m => m.Title, input.metadataInfo);

        }

        [Fact]
        public void MetadataInfoValidateTitleEmptyFailure()
        {
            var metadataInfo = metadataInfoFake.Generate();
            metadataInfo.Title = string.Empty;

            var input = new
            {
                metadataInfo
            };

            var Target = new MetadataInfoValidator();

            Target.ShouldHaveValidationErrorFor(m => m.Title, input.metadataInfo);
        }

        [Fact]
        public void MetadataInfoValidateTitleNullFailure()
        {
            var metadataInfo = metadataInfoFake.Generate();
            metadataInfo.Title = null;

            var input = new
            {
                metadataInfo
            };

            var Target = new MetadataInfoValidator();

            Target.ShouldHaveValidationErrorFor(m => m.Title, input.metadataInfo);
        }
    }
}
