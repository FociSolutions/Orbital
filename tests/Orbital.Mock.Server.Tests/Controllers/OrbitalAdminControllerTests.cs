using Bogus;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NSubstitute;
using Orbital.Mock.Server.Controllers;
using Orbital.Mock.Server.MockDefinitions.Commands;
using Orbital.Mock.Server.Models;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using Xunit;

namespace Orbital.Mock.Server.Tests.Controllers
{
    public class OrbitalAdminControllerTests
    {
        [Fact]
        public void PostSuccess()
        {
            #region Test Setup
            var metadataFake = new Faker<MetadataInfo>()
                    .RuleFor(m => m.Title, f => f.Lorem.Sentence())
                    .RuleFor(m => m.Description, f => f.Lorem.Paragraph());

            var mockDefinitionFake = new Faker<MockDefinition>()
                .RuleFor(m => m.Host, f => f.Internet.DomainName())
                .RuleFor(m => m.Metadata, f => metadataFake.Generate());


            var input = new
            {
                mockDefinition = mockDefinitionFake.Generate(),
                httpContext = new DefaultHttpContext(),
                path = "/api/v1.0/orbitaladmin"
            };

            input.httpContext.Request.Path = input.path;

            var controllerContext = new ControllerContext()
            {
                HttpContext = input.httpContext
            };

            var mediatorMock = Substitute.For<IMediator>();
            #endregion

            var Target = new OrbitalAdminController(mediatorMock)
            {
                ControllerContext = controllerContext
            };

            var encoded = Uri.EscapeUriString(input.mockDefinition.Metadata.Title);

            var Expected = new
            {
                location = $"{input.path}/{encoded}",
                value = input.mockDefinition
            };

            var Actual = Target.Post(input.mockDefinition);

            Assert.IsType<CreatedResult>(Actual);
            var actualCreateResult = Actual as CreatedResult;

            Assert.Equal(Expected.location, actualCreateResult.Location);
            Assert.Equal(Expected.value, actualCreateResult.Value);
        }

        [Fact]
        public void GetSuccess()
        {
            #region Test Setup

            var metadataFake = new Faker<MetadataInfo>()
                   .RuleFor(m => m.Title, f => f.Lorem.Sentence())
                   .RuleFor(m => m.Description, f => f.Lorem.Paragraph());

            var mockDefinitionFake = new Faker<MockDefinition>()
                .RuleFor(m => m.Host, f => f.Internet.DomainName())
                .RuleFor(m => m.Metadata, f => metadataFake.Generate());

            var input = new
            {
                mockDefinition = mockDefinitionFake.Generate(),
                httpContext = new DefaultHttpContext()
            };

            var mediatorMock = Substitute.For<IMediator>();

            mediatorMock.Send(Arg.Any<GetMockDefinitionByTitleCommand>(), Arg.Any<CancellationToken>()).Returns(input.mockDefinition);

            var controllerContext = new ControllerContext()
            {
                HttpContext = input.httpContext
            };
            #endregion


            var Target = new OrbitalAdminController(mediatorMock)
            {
                ControllerContext = controllerContext
            };

            var Actual = Target.Get(input.mockDefinition.Metadata.Title).Value;
            var Expected = input.mockDefinition;

            Assert.Equal(Actual, Expected);

        }
    }
}
