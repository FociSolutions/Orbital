﻿using System;
using System.IO;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Orbital.Mock.Server.IntegrationTests
{
    public static class CommonData
    {
        public enum MockDefinition
        {
            DefaultMock = 0,
            HeaderMock,
            QueryMock,
            BodyMock,
            EndpointMock
        }

        public const string PetStoreMockDefinition = @"./MockDefinitions/PetStoreMockDefinition.json";

        public static readonly string PetStoreMockBodyDefinitionTestExpected = File.ReadAllText(@"./MockDefinitions/PetStoreMockDefinitionBodyTestExpected.txt");

        public static string ServerBaseUri
        {
            get
            {
                var serverBaseUri = Environment.GetEnvironmentVariable("OrbitalServer.AppServiceApplicationUrl");
                return serverBaseUri != null ? serverBaseUri : "https://localhost:5001";
            }
        }

        public static string AdminUri => $"{ServerBaseUri}/api/v1/OrbitalAdmin";

        public static string GetFullPathToMockDefinition(MockDefinition mockDefinition)
        {
            switch (mockDefinition)
            {
                case MockDefinition.DefaultMock:
                    return @"./MockDefinitions/PetStoreMockDefinition.json";
                case MockDefinition.BodyMock:
                    return @"./MockDefinitions/PetStoreMockDefinitionBody.json";
                case MockDefinition.HeaderMock:
                    return @"./MockDefinitions/PetStoreMockDefinitionHeaders.json";
                case MockDefinition.EndpointMock:
                    return @"./MockDefinitions/PetStoreMockDefinitionEndpoint.json";
                default:
                    return @"./MockDefinitions/PetStoreMockDefinitionHeaders.json";
            }
        }

        public static string GetMockDefinitionText(MockDefinition mockDefinition)
        {
            var fullPathMockDefinition = File.ReadAllText(GetFullPathToMockDefinition(mockDefinition));
            try
            {
                JObject.Parse(fullPathMockDefinition);
            }
            catch (JsonReaderException e)
            {
                throw e;
            }

            return fullPathMockDefinition;
        }
    }
}