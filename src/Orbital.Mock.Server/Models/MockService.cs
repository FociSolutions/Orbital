//using EventAggregation.Receiver.API.Interfaces;
//using FluentValidation.Results;
using Newtonsoft.Json;
using System;
namespace Orbital.Mock.Server.Models
{
    public class MockService 
    {
        [JsonProperty("mockid")]
        public string MockId { get; set; }
        [JsonProperty("mockvalue")]
        public string MockValue { get; set; }
    }
}
