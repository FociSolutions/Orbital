using Bogus;
using FluentValidation.Results;
using FluentValidation.TestHelper;
using Orbital.Mock.Server.Models;
using Orbital.Mock.Server.Models.Validators;
using System;
using System.Collections.Generic;
using System.Text;
using Xunit;

namespace Orbital.Mock.Server.Tests.Models.Validators
{
    public class MetadataInfoValidatorTests
    {
        [Fact]
        public void MetadataInfoValidatorSuccessTest()
        {
            var metadataInfoFake = new Faker<MetadataInfo>()
                .RuleFor(m => m.Description, f => f.Lorem.Paragraph())
                .RuleFor(m => m.Title, f => f.Lorem.Sentence());

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
            var metadataInfoFake = new Faker<MetadataInfo>()
                .RuleFor(m => m.Title, f => string.Empty);

            var input = new
            {
                metadataInfo = metadataInfoFake.Generate()
            };

            var Target = new MetadataInfoValidator();
            
            Target.ShouldHaveValidationErrorFor(m => m.Title, input.metadataInfo);
        }

        [Fact]
        public void MetadataInfoValidateTitleNullFailure()
        {
            var metadataInfoFake = new Faker<MetadataInfo>()
                .RuleFor(m => m.Title, f => null);

            var input = new
            {
                metadataInfo = metadataInfoFake.Generate()
            };

            var Target = new MetadataInfoValidator();

            Target.ShouldHaveValidationErrorFor(m => m.Title, input.metadataInfo);
        }
    }
}
