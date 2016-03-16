using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Jquery.BlackGrid.Models {
    public class GridModel {
        public int? ParentId { get; set; }
        public List<string> SearchingColumns { get; set; }
        public string SearchingText { get; set; }
    }
}
