using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Orbital.Mock.Server.Models;

namespace Orbital.Mock.Server.Pipelines.Ports.Interfaces
{
    public interface IBodyMatchPort
    {
        string Body { get; set; }
        ICollection<MatchResult> BodyMatchResults { get; set; }
    }
}