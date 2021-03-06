﻿using LightBDD.Framework;
using LightBDD.Framework.Scenarios;
using LightBDD.XUnit2;
using Orbital.Mock.IntegrationTests;

namespace Orbital.Mock.Server.IntegrationTests.OrbitalAdmin.PutMockDefinition
{
    [FeatureDescription(
        @"In order to add a mock definition on the server
        a client hits the put orbital admin endpoint")]
    [Label("Story-1")]
    public partial class PutMockDefinition_Feature
    {
        [Scenario]
        [Label("Ticket-1")]
        [ClearServerScenarioDecorator]
        public void No_mock_definitions_loaded()
        {
            Runner.RunScenario(
                When_the_client_puts_a_mock_definition_by_id,
                Then_the_put_operation_returns_created);
        }
    }

}