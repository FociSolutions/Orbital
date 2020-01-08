using System.Text.RegularExpressions;

namespace Orbital.Mock.Server.Pipelines.Comparers
{
    public static class RegexComparer
    {
        /// <summary>
        /// This comparer evaluates if the provided regular expression finds a match in the requestToEvalute value. 
        /// </summary>
        /// <param name="regex">regular expression used to find a match</param>
        /// <param name="requestToEvalute">value to be matched against regular expression</param>
        /// <returns>whether a match was found on requestToEvalute</returns>
        public static bool Compare(string requestToEvalute, string regex)
        {
            return Regex.IsMatch(requestToEvalute, regex);
        }
    }
}
