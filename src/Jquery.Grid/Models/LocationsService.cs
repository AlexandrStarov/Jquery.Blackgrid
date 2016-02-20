using System.Collections.Generic;

namespace Jquery.BlackGrid.Models {
    public class LocationsService
    {
        public static List<Location> GetLocations() {
            var locations = new List<Location> {
            new Location {Id = 0, ParentId = null, Name = "Ukraine", Description = "Country",  HasChildren = true },
            new Location {Id = 1, ParentId = 0, Name = "Kharkov", Description = "City",  HasChildren = true },
            new Location {Id = 2, ParentId = 0, Name = "Kiev", Description = "City",  HasChildren = false },
            new Location {Id = 3, ParentId = 0, Name = "Odessa", Description = "City",  HasChildren = false },
            new Location {Id = 4, ParentId = null, Name = "Russia", Description = "Country",  HasChildren = true },
            new Location {Id = 5, ParentId = 4, Name = "Moscow", Description = "City",  HasChildren = false },
            new Location {Id = 6, ParentId = 4, Name = "Belgorod", Description = "City",  HasChildren = false },
            new Location {Id = 7, ParentId = null, Name = "Poland", Description = "Country",  HasChildren = true },
            new Location {Id = 8, ParentId = 7, Name = "Warsaw", Description = "City",  HasChildren = false },
            new Location {Id = 9, ParentId = 7, Name = "Krakow", Description = "City",  HasChildren = false },
            new Location {Id = 10, ParentId = 1, Name = "Balakleya", Description = "City",  HasChildren = false },
            new Location {Id = 11, ParentId = 1, Name = "Bogoduhov", Description = "City",  HasChildren = false },
            new Location {Id = 12, ParentId = 1, Name = "Zmiiv", Description = "City",  HasChildren = false },
            new Location {Id = 13, ParentId = 1, Name = "Izium", Description = "City",  HasChildren = false },
            new Location {Id = 14, ParentId = null, Name = "Italy", Description = "Country",  HasChildren = false }
        };
            return locations;
        }
    }
}
