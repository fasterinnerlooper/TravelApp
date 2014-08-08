using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BanjiTravelApp.Models
{
    public class Profile
    {
        public int ProfileId { get; set; }
        public string Username { get; set; }
        public string DisplayName { get; set; }
        public string EmailAddress { get; set; }
        public ICollection<Marker> Markers { get; set; }
        public ICollection<Friends> Friends { get; set; }
    }
}