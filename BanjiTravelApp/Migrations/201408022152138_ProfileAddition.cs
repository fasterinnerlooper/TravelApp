namespace BanjiTravelApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ProfileAddition : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.TravelPlans", "startDate", c => c.DateTime(nullable: false));
            AddColumn("dbo.TravelPlans", "endDate", c => c.DateTime(nullable: false));
            AddColumn("dbo.TravelPlans", "endMarker_MarkerId", c => c.Int());
            AddColumn("dbo.TravelPlans", "startMarker_MarkerId", c => c.Int());
            CreateIndex("dbo.TravelPlans", "endMarker_MarkerId");
            CreateIndex("dbo.TravelPlans", "startMarker_MarkerId");
            AddForeignKey("dbo.TravelPlans", "endMarker_MarkerId", "dbo.Markers", "MarkerId");
            AddForeignKey("dbo.TravelPlans", "startMarker_MarkerId", "dbo.Markers", "MarkerId");
            DropColumn("dbo.TravelPlans", "travelDate");
        }
        
        public override void Down()
        {
            AddColumn("dbo.TravelPlans", "travelDate", c => c.DateTime(nullable: false));
            DropForeignKey("dbo.TravelPlans", "startMarker_MarkerId", "dbo.Markers");
            DropForeignKey("dbo.TravelPlans", "endMarker_MarkerId", "dbo.Markers");
            DropIndex("dbo.TravelPlans", new[] { "startMarker_MarkerId" });
            DropIndex("dbo.TravelPlans", new[] { "endMarker_MarkerId" });
            DropColumn("dbo.TravelPlans", "startMarker_MarkerId");
            DropColumn("dbo.TravelPlans", "endMarker_MarkerId");
            DropColumn("dbo.TravelPlans", "endDate");
            DropColumn("dbo.TravelPlans", "startDate");
        }
    }
}
