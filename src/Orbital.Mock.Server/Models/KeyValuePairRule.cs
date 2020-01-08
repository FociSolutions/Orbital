using Orbital.Mock.Server.Models.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Orbital.Mock.Server.Models
{
    public class KeyValuePairRule : IRule
    {
        public Type ComparerType { get; }
        public KeyValuePair<string, string> RuleValue = new KeyValuePair<string, string>();
    }
}
