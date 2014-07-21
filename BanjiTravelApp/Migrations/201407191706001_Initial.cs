namespace BanjiTravelApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Initial : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Markers",
                c => new
                    {
                        MarkerId = c.Int(nullable: false, identity: true),
                        name = c.String(maxLength: 4000),
                        Latitude = c.Double(nullable: false),
                        Longitude = c.Double(nullable: false),
                        ProfileId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.MarkerId)
                .ForeignKey("dbo.Profiles", t => t.ProfileId, cascadeDelete: true)
                .Index(t => t.ProfileId);
            
            CreateTable(
                "dbo.Profiles",
                c => new
                    {
                        ProfileId = c.Int(nullable: false, identity: true),
                        Username = c.String(maxLength: 4000),
                        DisplayName = c.String(maxLength: 4000),
                        EmailAddress = c.String(maxLength: 4000),
                    })
                .PrimaryKey(t => t.ProfileId);
            
            CreateTable(
                "dbo.TravelPlans",
                c => new
                    {
                        TravelPlanId = c.Int(nullable: false, identity: true),
                        ProfileId = c.Int(nullable: false),
                        Date = c.DateTime(nullable: false),
                        Experience = c.String(maxLength: 4000),
                        Likes = c.String(maxLength: 4000),
                        Dislikes = c.String(maxLength: 4000),
                    })
                .PrimaryKey(t => t.TravelPlanId)
                .ForeignKey("dbo.Profiles", t => t.ProfileId, cascadeDelete: true)
                .Index(t => t.ProfileId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.TravelPlans", "ProfileId", "dbo.Profiles");
            DropForeignKey("dbo.Markers", "ProfileId", "dbo.Profiles");
            DropIndex("dbo.TravelPlans", new[] { "ProfileId" });
            DropIndex("dbo.Markers", new[] { "ProfileId" });
            DropTable("dbo.TravelPlans");
            DropTable("dbo.Profiles");
            DropTable("dbo.Markers");
        }
    }
}
