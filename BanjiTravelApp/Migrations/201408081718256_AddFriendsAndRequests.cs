namespace BanjiTravelApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddFriendsAndRequests : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.FriendRequests",
                c => new
                    {
                        FromUserId = c.Int(nullable: false),
                        ToUserId = c.Int(nullable: false),
                        requestDateTime = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => new { t.FromUserId, t.ToUserId })
                .ForeignKey("dbo.Profiles", t => t.FromUserId, cascadeDelete: false)
                .ForeignKey("dbo.Profiles", t => t.ToUserId, cascadeDelete: false)
                .Index(t => t.FromUserId)
                .Index(t => t.ToUserId);
            
            CreateTable(
                "dbo.Friends",
                c => new
                    {
                        UserId1 = c.Int(nullable: false),
                        UserId2 = c.Int(nullable: false),
                        Profile_ProfileId = c.Int(),
                    })
                .PrimaryKey(t => new { t.UserId1, t.UserId2 })
                .ForeignKey("dbo.Profiles", t => t.UserId1, cascadeDelete: false)
                .ForeignKey("dbo.Profiles", t => t.UserId2, cascadeDelete: false)
                .ForeignKey("dbo.Profiles", t => t.Profile_ProfileId)
                .Index(t => t.UserId1)
                .Index(t => t.UserId2)
                .Index(t => t.Profile_ProfileId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.FriendRequests", "ToUserId", "dbo.Profiles");
            DropForeignKey("dbo.FriendRequests", "FromUserId", "dbo.Profiles");
            DropForeignKey("dbo.Friends", "Profile_ProfileId", "dbo.Profiles");
            DropForeignKey("dbo.Friends", "UserId2", "dbo.Profiles");
            DropForeignKey("dbo.Friends", "UserId1", "dbo.Profiles");
            DropIndex("dbo.Friends", new[] { "Profile_ProfileId" });
            DropIndex("dbo.Friends", new[] { "UserId2" });
            DropIndex("dbo.Friends", new[] { "UserId1" });
            DropIndex("dbo.FriendRequests", new[] { "ToUserId" });
            DropIndex("dbo.FriendRequests", new[] { "FromUserId" });
            DropTable("dbo.Friends");
            DropTable("dbo.FriendRequests");
        }
    }
}
