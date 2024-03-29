﻿using System.Collections.Generic;

using Orbital.Mock.Definition.Match;

namespace Orbital.Mock.Server.Pipelines.Ports.Interfaces
{
    public interface IBodyMatchPort : IMatchPort
    {
        string Body { get; set; }
        ICollection<MatchResult> BodyMatchResults { get; set; }
    }
}