using Orbital.Mock.Server.Models;
using Orbital.Mock.Server.Models.Interfaces;
using System;

namespace Orbital.Mock.Server.Pipelines.Policies
{
    public static class PolicyExecuter
    {
        public static bool ExecutePolicy(Policy policy)
        {
            switch (policy.Type) {
                case PolicyType.DELAYRESPONSE:
                    int millisecondDelay = Convert.ToInt32(policy.Attributes["delay"]);
                    return DelayPolicy.Execute(millisecondDelay);
                default:
                    return true;
            }
        }
    }
}
