using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace BanjiTravelApp.Models
{
    public class TravelPlan
    {
        public int TravelPlanId { get; set; }
        public int ProfileId { get; set; }
        [ForeignKey("ProfileId")]
        public Profile Profile { get; set; }
        public DateTime startDate { get; set; }
        public DateTime endDate { get; set; }
        public Marker startMarker { get; set; }
        public Marker endMarker { get; set; }
    }
}