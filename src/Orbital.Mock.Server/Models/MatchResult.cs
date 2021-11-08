using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;

namespace Orbital.Mock.Server.Models
{
    /// <summary>
    /// The matched rule for the data.
    /// </summary>
    public class MatchResult
    {
        public MatchResult(MatchResultType match, string scenarioId, bool defaultScenario)
        {
            if (String.IsNullOrWhiteSpace(scenarioId))
            {
                throw new ArgumentException("Scenario Id cannot be empty", nameof(scenarioId));
            }

            Match = match;
            ScenarioId = scenarioId;
            DefaultScenario = defaultScenario;
        }

        /// <summary>
        /// The scenario which the rule matched
        /// </summary>
        public string ScenarioId { get; }

        /// <summary>
        /// The strength of the match
        /// </summary>
        public MatchResultType Match { get; }

        /// <summary>
        /// Whether this scenario is a default scenario
        /// </summary>
        public bool DefaultScenario { get;  }

        protected bool Equals(MatchResult other)
        {
            return ScenarioId.Equals(other.ScenarioId);
        }

        public override bool Equals(object obj)
        {
            if (ReferenceEquals(null, obj)) return false;
            if (ReferenceEquals(this, obj)) return true;
            if (obj.GetType() != this.GetType()) return false;
            return Equals((MatchResult)obj);
        }

        public override int GetHashCode()
        {
            return (ScenarioId != null ? ScenarioId.GetHashCode() : 0);
        }

        public static MatchResult Create(MatchResultType type, Scenario scenario)
        {
            return new MatchResult(type, scenario.Id, scenario.defaultScenario);
        }
    }
}