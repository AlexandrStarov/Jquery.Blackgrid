using Newtonsoft.Json;

namespace Jquery.BlackGrid.Models {
    public class Location
    {
        [JsonProperty(PropertyName = "id")]
        public int Id { get; set; }
        [JsonProperty(PropertyName = "parentId")]
        public int? ParentId { get; set; }
        [JsonProperty(PropertyName = "name")]
        public string Name { get; set; }
        [JsonProperty(PropertyName = "description")]
        public string Description { get; set; }
        [JsonProperty(PropertyName = "hasChildren")]
        public bool HasChildren { get; set; }
    }
}
