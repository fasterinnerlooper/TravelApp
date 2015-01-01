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
        public virtual DbSet<Profile> Profiles { get; set; }
        public virtual DbSet<Marker> Markers { get; set; }
        public virtual DbSet<TravelPlan> TravelPlans { get; set; }
        public virtual DbSet<FriendRequest> FriendRequests { get; set; }
        public virtual DbSet<Friends> Friends { get; set; }
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            //FriendRequest
            modelBuilder.Properties()
                .Where(x => x.Name == "ToUserId")
                .Configure(x => x.IsKey().HasColumnOrder(1));
            modelBuilder.Properties()
                .Where(x => x.Name == "FromUserId")
                .Configure(x => x.IsKey().HasColumnOrder(2));

            //FriendsRelationship
            modelBuilder.Properties()
                .Where(x => x.Name == "UserId1")
                .Configure(x => x.IsKey().HasColumnOrder(1));
            modelBuilder.Properties()
                .Where(x => x.Name == "UserId2")
                .Configure(x => x.IsKey().HasColumnOrder(2));

            base.OnModelCreating(modelBuilder);
        }
    }
}