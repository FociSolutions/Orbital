using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Orbital.Mock.Server.Converters
{
    public class KeyValueConverter : JsonConverter
    {
        public override bool CanConvert(Type objectType)
        {
            return (objectType == typeof(KeyValuePair<string, string>));
        }

        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
        {
            JObject obj = JObject.Load(reader);
            KeyValuePair<string, string> dict;
            
             var kv = obj.Properties().First();

            dict = new KeyValuePair<string, string>(kv.Name, kv.Value.ToString() );
            return dict;
        }

        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {
            KeyValuePair<string, string> dict = (KeyValuePair<string, string>)value;
           JObject obj = new JObject();
            obj.Add(dict.Key,dict.Value);
            obj.WriteTo(writer);
        }
    }
}
