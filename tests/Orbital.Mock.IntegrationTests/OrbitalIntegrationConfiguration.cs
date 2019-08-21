using LightBDD.XUnit2;
using Newtonsoft.Json.Linq;
using Orbital.Mock.Server.IntegrationTests;
using System;
using System.Linq;
using System.Net.Http;
using Xunit.Abstractions;

[assembly: OrbitalIntegrationConfiguration]

namespace Orbital.Mock.Server.IntegrationTests
{
    public class OrbitalIntegrationConfiguration : LightBddScopeAttribute
    {
        public ITestOutputHelper OutputHelper { get; }

        protected override void OnSetUp()
        {
            var client = new HttpClient();
            var response = client.GetAsync(CommonData.ServerBaseUri).Result;
            var content = response.Content.ReadAsStringAsync().Result;
            try
            {
                var mockDefinitionTokens = JArray.Parse(content);
                foreach (var mockDefinitionToken in mockDefinitionTokens)
                {
                    var mockId = mockDefinitionToken.SelectToken("metadata.title").ToString();
                    client.DeleteAsync($"{CommonData.ServerBaseUri}/{mockId}").Wait();
                }
            }
            catch (Exception)
            {
            }
        }
    }
}