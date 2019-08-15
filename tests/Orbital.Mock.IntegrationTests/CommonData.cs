using System;

namespace Orbital.Mock.Server.IntegrationTests
{
    public static class CommonData
    {
        public static string ServerBaseUri
        {
            get
            {
                var serverBaseUri = Environment.GetEnvironmentVariable("OrbitalServer.AppServiceApplicationUrl");
                return serverBaseUri != null ? serverBaseUri : "https://localhost:5001/api/v1/OrbitalAdmin";
            }
        }
    }
}