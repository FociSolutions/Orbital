using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Orbital.Mock.Server.Models.Interfaces
{
    public interface IRule
    {
        Type ComparerType { get; }
    }

    public enum ComparerType
    {
        Regex = 1,
        StartWith = 2,
        EndWith = 3,
        Equal = 4,
        Contains = 5
    };
}
