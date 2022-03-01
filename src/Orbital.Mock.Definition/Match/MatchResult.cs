using System;
using System.Linq;
using System.Collections.Generic;

namespace Orbital.Mock.Definition.Match
{
    /// <summary>
    /// The matched rule for the data.
    /// </summary>
    public class MatchResult
    {
        public MatchResult(MatchResultType match, string scenarioId, bool defaultScenario)
        {
            if (string.IsNullOrWhiteSpace(scenarioId)) throw new ArgumentException("Scenario Id cannot be empty", nameof(scenarioId));

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

        /// <summary>
        /// Creates a MatchResult given a scenario and type
        /// </summary>
        /// <param name="type">the enum MatchResultType</param>
        /// <param name="scenario">the given Scenario</param>
        /// <returns>A MatchResult Object</returns>
        public static MatchResult Create(MatchResultType type, Scenario scenario)
        {
            return new MatchResult(type, scenario.Id, scenario.DefaultScenario);
        }

        /// <summary>
        /// Creates an IEnumerable of MatchResults based on a 
        /// given IEnumerable of scenarios and a type
        /// </summary>
        /// <param name="type">the specified MatchResultType</param>
        /// <param name="scenarios">the list of scenarios</param>
        /// <returns>An IEnumerable of MatchResults</returns>
        public static IEnumerable<MatchResult> CreateAll(MatchResultType type, IEnumerable<Scenario> scenarios)
        {
            return scenarios.Select(s => Create(type, s));
        }
    }
}