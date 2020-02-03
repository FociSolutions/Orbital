namespace Orbital.Mock.Server.Pipelines.Comparers
{
    public static class TextComparer
    {
        /// <summary>
        /// This comparer evaluates if the rule equals the request string. 
        /// </summary>
        /// <param name="rule">the rule to prove if the request is valid</param>
        /// <param name="requestToEvaluate">value to be matched against the rule</param>
        /// <returns>whether a match was found with requestToEvalute and rule provided</returns>
        public static bool Equals(string requestToEvaluate, string rule)
        {
            return rule.Equals(requestToEvaluate);
        }

        /// <summary>
        /// This comparer evaluates if the rule contains the request string. 
        /// </summary>
        /// <param name="rule">the rule to prove if the request is valid</param>
        /// <param name="requestToEvaluate">value to be matched against the rule</param>
        /// <returns>whether a match was found with requestToEvalute and rule provided</returns>
        public static bool Contains(string requestToEvaluate, string rule)
        {
            return requestToEvaluate.Contains(rule);
        }

        /// <summary>
        /// This comparer evaluates if the rule starts with the request string. 
        /// </summary>
        /// <param name="rule">the rule to prove the request is valid</param>
        /// <param name="requestToEvaluate">value to be matched against the rule</param>
        /// <returns>whether a match was found with requestToEvalute and rule provided</returns>
        public static bool StartsWith(string requestToEvaluate, string rule)
        {
            return requestToEvaluate.StartsWith(rule);
        }

        /// <summary>
        /// This comparer evaluates if the rule ends with the request string. 
        /// </summary>
        /// <param name="rule">the rule to prove if the request is valid</param>
        /// <param name="requestToEvaluate">value to be matched against the rule</param>
        /// <returns>whether a match was found with requestToEvalute and rule provided</returns>
        public static bool EndsWith(string requestToEvaluate, string rule)
        {
            return requestToEvaluate.EndsWith(rule);
        }
    }
}
