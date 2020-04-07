using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Orbital.Mock.Server.Registrations;
using Microsoft.AspNetCore.Mvc.ApiExplorer;
using System.Diagnostics.CodeAnalysis;
using FluentValidation.AspNetCore;
using Orbital.Mock.Server.Models.Validators;
using MediatR;
using Orbital.Mock.Server.Models.Converters;
using Orbital.Mock.Server.Pipelines;
using Orbital.Mock.Server.Middleware;
using Orbital.Mock.Server.Pipelines.Models.Interfaces;
using Orbital.Mock.Server.Pipelines.Models;
using Orbital.Mock.Server.Models;
using Orbital.Mock.Server.Factories.Interfaces;
using Orbital.Mock.Server.Factories;
using Orbital.Mock.Server.Pipelines.RuleMatchers;
using Orbital.Mock.Server.Pipelines.RuleMatchers.Interfaces;
using Scriban;
using Bogus;
using Orbital.Mock.Server.Functions;
using Scriban.Runtime;

namespace Orbital.Mock.Server
{
    [ExcludeFromCodeCoverage]
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }
        public IConfiguration Configuration { get; }

        /// <summary>
        /// This method gets called by the runtime. Use this method to add services to the container.
        /// </summary>
        /// <param name="services"></param>
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors(o => o.AddPolicy("OrbitalPolicy", builder =>
            {
                builder.AllowAnyOrigin()
                    .AllowAnyMethod()
                    .AllowAnyHeader();
            }));

            services.AddMvc()
                .AddJsonOptions(options => { options.SerializerSettings.Converters.Add(new OpenApiJsonConverter()); })
                .AddFluentValidation(fv => fv.RegisterValidatorsFromAssemblyContaining<MetadataInfoValidator>())
                .SetCompatibilityVersion(CompatibilityVersion.Version_2_2);

            services.AddMemoryCache();
            services.AddMediatR(typeof(Startup).Assembly);

            services.AddSingleton<IAssertFactory, AssertFactory>();
            services.AddSingleton<IRuleMatcher, RuleMatcher>();
            services.AddSingleton<IPipeline<MessageProcessorInput, Task<MockResponse>>>(s =>
            {
                var processor = new MockServerProcessor(new AssertFactory(), new RuleMatcher(), ConfigureTemplateContext());
                processor.Start();
                return processor;
            });
            services.AddSingleton<CommonData>();

            ApiVersionRegistration.ConfigureService(services);
            SwaggerRegistration.ConfigureService(services);
            
        }

        /// <summary>
        /// This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        /// </summary>
        /// <param name="app"></param>
        /// <param name="env"></param>
        /// <param name="provider"></param>
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, IApiVersionDescriptionProvider provider)

        {
            app.UseCors(builder => builder.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin());
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseSwagger();
            app.UseSwaggerUI(o =>
            {
                o.RoutePrefix = "api/swagger";
                foreach (var version in provider.ApiVersionDescriptions)
                {
                    o.SwaggerEndpoint($"/swagger/{version.GroupName}/swagger.json", version.GroupName.ToUpperInvariant());
                }
            });

            app.UseMiddleware<LoggingRequestResponseMiddleware>();
            app.UseMiddleware<ServerRequestMiddleware>();
            app.UseMvc();
        }

        /// <summary>
        /// This method creates the template context with buildin functions needed for templaded responses to work..
        /// </summary>
        private TemplateContext ConfigureTemplateContext()
        {
            var globalContext = new TemplateContext();

            var scriptObjectOrbital = new BuiltinOrbitalFunctions();
            var scriptObjectFaker = new ScriptObject();
            scriptObjectFaker.Import(new Faker());

            globalContext.PushGlobal(scriptObjectFaker);
            globalContext.PushGlobal(scriptObjectOrbital);
            

            return globalContext;
        }
    }
}
