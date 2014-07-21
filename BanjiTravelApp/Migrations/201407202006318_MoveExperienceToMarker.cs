namespace BanjiTravelApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class MoveExperienceToMarker : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Markers", "Date", c => c.DateTime(nullable: false));
            AddColumn("dbo.Markers", "Experience", c => c.String(maxLength: 4000));
            AddColumn("dbo.Markers", "Likes", c => c.String(maxLength: 4000));
            AddColumn("dbo.Markers", "Dislikes", c => c.String(maxLength: 4000));
            DropColumn("dbo.TravelPlans", "Date");
            DropColumn("dbo.TravelPlans", "Experience");
            DropColumn("dbo.TravelPlans", "Likes");
            DropColumn("dbo.TravelPlans", "Dislikes");
        }
        
        public override void Down()
        {
            AddColumn("dbo.TravelPlans", "Dislikes", c => c.String(maxLength: 4000));
            AddColumn("dbo.TravelPlans", "Likes", c => c.String(maxLength: 4000));
            AddColumn("dbo.TravelPlans", "Experience", c => c.String(maxLength: 4000));
            AddColumn("dbo.TravelPlans", "Date", c => c.DateTime(nullable: false));
            DropColumn("dbo.Markers", "Dislikes");
            DropColumn("dbo.Markers", "Likes");
            DropColumn("dbo.Markers", "Experience");
            DropColumn("dbo.Markers", "Date");
        }
    }
}
