using System.Text.RegularExpressions;

namespace Orbital.Mock.Server.Pipelines.Comparers
{
    public static class RegexComparer
    {
        /// <summary>
        /// This comparer evaluates if the regular expression provided finds a match in the requestToEvalute value. 
        /// </summary>
        /// <param name="regex">regular expression used to find a match</param>
        /// <param name="requestToEvalute">value to be used against regular expression</param>
        /// <returns>a flag indicating if a match was found on requestToEvalute</returns>
        public static bool Compare(string requestToEvalute, string regex)
        {
            return Regex.IsMatch(requestToEvalute, regex);
        }
    }
}
