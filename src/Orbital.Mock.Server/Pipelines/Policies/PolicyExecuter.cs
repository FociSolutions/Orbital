using System;

using Orbital.Mock.Definition.Policies;

namespace Orbital.Mock.Server.Pipelines.Policies
{
    public static class PolicyExecuter
    {
        public static bool ExecutePolicy(Policy policy)
        {
            switch (policy.Type) {
                case PolicyType.DELAYRESPONSE:
                    int millisecondDelay = Convert.ToInt32(policy.Value);
                    return DelayPolicy.Execute(millisecondDelay);
                default:
                    return true;
            }
        }
    }
}
