using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json.Schema;
using System;
using System.Linq;
using System.Text.RegularExpressions;

namespace Orbital.Mock.Server.Pipelines.Comparers
{
    public static class JsonComparer
    {
        /// <summary>
        /// Compares two JSON blobs for equality. If a blob is not 
        /// JSON, then they are considered not equal.
        /// </summary>
        /// <param name="expected"> expected json blob</param>
        /// <param name="actual"> actualy json blob</param>
        /// <returns> The equality of the two  blobs.</returns>
        public static bool DeepEqual(string expected, string actual)
        {
            try
            {
                var actualEquality = JToken.Parse(actual);
                var expectedEquality = JToken.Parse(expected);
                return JToken.DeepEquals(expectedEquality, actualEquality);
            }
            catch (JsonReaderException)
            {
                return false;
            }
        }

        /// <summary>
        /// Checks if the request JSON matches the provided schema
        /// </summary>
        /// <param name="schema">The JSON schema to validate against</param>
        /// <param name="request">The JSON to validate against the schema</param>
        /// <returns>Whether the provided JSON matches the schema</returns>
        public static bool MatchesSchema(string request, string schema)
        {
            return JObject.Parse(request).IsValid(JSchema.Parse(schema));
        }

        /// <summary>
        /// String overload of the private Deep Contains
        /// </summary>
        /// <param name="needle"> The string to check </param>
        /// <param name="haystack">The larger string to check against </param>
        /// <returns> Whether it contains the JSON string</returns>
        public static bool DeepContains(string needle, string haystack)
        {
            try
            {
                var expected = JToken.Parse(needle);
                var actual = JToken.Parse(haystack);

                return DeepContains(expected.HasValues ? expected.First : expected, actual);
            }
            catch (JsonReaderException)
            {
                return false;
            }
        }

        /// <summary>
        /// Checks if a JSON object is contained within another one recursively
        /// </summary>
        /// <param name="needle">The object to check</param>
        /// <param name="haystack">The larger object to check against</param>
        /// <returns>Whether it contains the JSON object</returns>
        private static bool DeepContains(JToken needle, JToken haystack)
        {
            foreach (var prop in haystack.OfType<JProperty>())
            {
                if (JToken.DeepEquals(needle, prop) || DeepContains(needle, prop.Value))
                {
                    return true;
                }                
            }
            return false;
        }

        /// <summary>
        /// Checks if a JSON path exists in a JSON snippet. It does not find the value associated with the path,
        /// just whether it exists.
        /// </summary>
        /// <param name="path">The JSON path</param>
        /// <param name="items">The JSON snippet to search</param>
        /// <returns></returns>
        public static bool PathEqual(string path, JToken items)
        {
            try
            {
                var selectedItems = items.SelectTokens(JsonConvert.DeserializeObject<string>(path), errorWhenNoMatch: true);
                return selectedItems.Any();
            }
            catch (JsonException)
            {
                return false;
            }
        }

        /// <summary>
        /// Checks if a JSON path exists in a JSON snippet. It does not find the value associated with the path,
        /// just whether it exists.
        /// </summary>
        /// <param name="path">The JSON path</param>
        /// <param name="items">The JSON snippet to search</param>
        /// <returns>Whether the path matches the json string</returns>
        public static bool PathEqual(string path, string items)
        {
            try
            {
                return PathEqual(path, JObject.Parse(items));
            }
            catch(JsonReaderException)
            {
                return false;
            }
            
        }
    }
}
