using Orbital.Mock.Server.Models;
using Orbital.Mock.Server.Models.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Orbital.Mock.Server.Pipelines.Policies
{
    public class PolicyExecuter
    {
        public bool ExecutePolicy(Policy policy)
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
