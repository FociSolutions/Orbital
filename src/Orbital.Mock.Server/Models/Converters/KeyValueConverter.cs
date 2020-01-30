using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Orbital.Mock.Server.Models.Converters
{
    public class KeyValueConverter : JsonConverter
    {
        /// <summary>
        /// Checks if value provided is a key/value pair
        /// </summary>
        /// <param name="objectType">Type of the object to check against</param>
        public override bool CanConvert(Type objectType)
        {
            return (objectType == typeof(KeyValuePair<string, string>));
        }

        /// <summary>
        /// Loads key value pair json object and creates a c# KeyValuePair object with the Name and Value of the JObject
        /// </summary>
        /// <param name="reader">The JsonReader that reads the incoming json</param>
        /// <returns>The new key value pair </returns>
        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
        {
            JObject obj = JObject.Load(reader);
            KeyValuePair<string, string> dict;
            
             var kv = obj.Properties().First();

            dict = new KeyValuePair<string, string>(kv.Name, kv.Value.ToString() );
            return dict;
        }

        /// <summary>
        /// Writes an Object into JSON
        /// This method only writes the C# KeyValuePairObject into a JObject
        /// </summary>
        /// <param name="writer">The JsonWriter used to write the json output</param>
        /// <param name="value">The object to turn into Json</param>
        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {
            KeyValuePair<string, string> dict = (KeyValuePair<string, string>)value;
           JObject obj = new JObject();
            obj.Add(dict.Key,dict.Value);
            obj.WriteTo(writer);
        }
    }
}
