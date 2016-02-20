using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.Mvc;
using Jquery.BlackGrid.Models;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace Jquery.BlackGrid.ApiControllers
{
    [Route("api/[controller]")]
    public class CountriesController : Controller
    {
        // GET: api/values
        [HttpPost]
        public IEnumerable<Location> Get([FromBody] int? parentId) {
            var locations = new List<Location>();

            if (parentId == null)
                locations = LocationsService.GetLocations()
                    .Where(location => location.ParentId == parentId)
                    .ToList();
            else
                locations = LocationsService.GetLocations();

            return locations;
        }


        // GET: api/values
        [HttpPost("test")]
        public IEnumerable<Location> GetTest([FromBody] int? parentId) {
            var locations = new List<Location>();

            if (parentId == null)
                locations = LocationsService.GetLocations()
                    .Where(location => location.ParentId == parentId)
                    .ToList();
            else
                locations = LocationsService.GetLocations();

            return locations;
        }
    }
}
