namespace BanjiTravelApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class TravelPlanTravelDate : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.TravelPlans", "travelDate", c => c.DateTime(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.TravelPlans", "travelDate");
        }
    }
}
