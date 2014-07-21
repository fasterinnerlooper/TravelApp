using BanjiTravelApp.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace BanjiTravelApp.Context
{
    public class TravelAppContext : DbContext
    {
        public TravelAppContext() : base("TravelAppCompactDatabase")
        {
                
        }
        public DbSet<Profile> Profiles { get; set; }
        public DbSet<Marker> Markers { get; set; }
        public DbSet<TravelPlan> TravelPlans { get; set; }
    }
}