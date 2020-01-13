using Orbital.Mock.Server.Models.Rules;
using Orbital.Mock.Server.Pipelines.Ports.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Orbital.Mock.Server.Pipelines.RuleMatchers.KeyValueMatchers
{
    public abstract class KeyValuePairMatchRule : RuleComparer<KeyValuePairRule, IMatchPort>, IKeyValuePairMatchRule { }
}
