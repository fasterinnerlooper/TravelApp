using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace BanjiTravelApp.Models
{
    public class Marker
    {
        public int MarkerId { get; set; }
        public string name { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public int ProfileId { get; set; }
        public DateTime Date { get; set; }
        public string Experience { get; set; }
        public string Likes { get; set; }
        public string Dislikes { get; set; }
        [ForeignKey("ProfileId")]
        public virtual Profile Profile { get; set; }
    }
}