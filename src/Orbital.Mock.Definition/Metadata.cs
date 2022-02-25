using System;

using Newtonsoft.Json;

namespace Orbital.Mock.Definition
{
    public class Metadata : IEquatable<Metadata>
    {
        [JsonProperty("title")]
        public string Title { get; set; }
        [JsonProperty("description")]
        public string Description { get; set; }

        public override bool Equals(object obj)
        {
            return Equals(obj as Metadata);
        }

        public bool Equals(Metadata other)
        {
            return other != null &&
                   Title == other.Title &&
                   Description == other.Description;
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(Title, Description);
        }
    }
}
