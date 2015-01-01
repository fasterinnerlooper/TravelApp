using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BanjiTravelApp.Context;
using BanjiTravelApp.Controllers;
using BanjiTravelApp.Models;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using System.Web.Http.Results;

namespace BanjiTravelApp.Tests.Controllers
{
    [TestClass]
    public class MarkerControllerTest
    {
        Mock<DbSet<Marker>> mockMarker;
        Mock<TravelAppContext> mockDataContext;
        MarkerController sut;
        Marker marker1;

        [TestInitialize]
        public void SetUp()
        {
            mockMarker = new Mock<DbSet<Marker>>();
            mockDataContext = new Mock<TravelAppContext>();
            mockDataContext.Setup(m => m.Markers).Returns(mockMarker.Object);
            sut = new MarkerController();
            sut.db = mockDataContext.Object;

            marker1 = new Marker
            {
                Date = new DateTime(2014, 12, 12),
                Dislikes = "User 1 Dislikes",
                Experience = "User 1 Experience",
                Latitude = 1.0d,
                Longitude = 2.0d
            };
        }

        [TestMethod]
        public void ShouldSaveMarkerData()
        {
            sut.PostMarker(marker1);
            mockMarker.Verify(m=>m.Add(It.IsAny<Marker>()), Times.Once);
        }

        [TestMethod]
        public void ShouldSaveExperienceToOtherUsersMarker()
        {
            var markerList = new List<Marker>().AsQueryable();
            mockMarker.As<IQueryable<Marker>>().Setup(m => m.Provider).Returns(markerList.Provider);
            mockMarker.As<IQueryable<Marker>>().Setup(m => m.Expression).Returns(markerList.Expression);
            mockMarker.As<IQueryable<Marker>>().Setup(m => m.ElementType).Returns(markerList.ElementType);
            mockMarker.As<IQueryable<Marker>>().Setup(m => m.GetEnumerator()).Returns(markerList.GetEnumerator());

            var marker2 = new Marker
            {
                Experience = "My Experience",
                Latitude = 1.0d,
                Longitude = 2.0d
            };
            sut.PostMarker(marker1);
            sut.PostMarker(marker2);

            var postedMarkers = markerList as List<Marker>;
            mockMarker.Verify(m => m.Add(marker1));
            mockMarker.Verify(m => m.Add(marker2));
        }

        [TestMethod]
        public void ShouldGetAllFriendsMarkersAtTheSameLocation()
        {
            var markerList = new List<Marker> {
                new Marker { ProfileId =1, Latitude= 1.0d,Longitude=2.0d, Experience="User 1 Experience"},
                new Marker {ProfileId=2,   Latitude=1.0d, Longitude=2.0d, Experience="User 2 Experience"},
                new Marker {ProfileId=3,   Latitude=1.0d, Longitude=2.0d, Experience="User 3 Experience"},
                new Marker { ProfileId=4,  Latitude=1.0d, Longitude=2.0d, Experience="User 4 Experience"}
            }.AsQueryable();

            var friendsData = new List<Friends> {
                new Friends {UserId1=1, UserId2=2},
                new Friends {UserId1=1, UserId2=3},
                new Friends {UserId1=2, UserId2=3}
            }.AsQueryable();

            mockMarker.As<IQueryable<Marker>>().Setup(m => m.Provider).Returns(markerList.Provider);
            mockMarker.As<IQueryable<Marker>>().Setup(m => m.Expression).Returns(markerList.Expression);
            mockMarker.As<IQueryable<Marker>>().Setup(m => m.ElementType).Returns(markerList.ElementType);
            mockMarker.As<IQueryable<Marker>>().Setup(m => m.GetEnumerator()).Returns(markerList.GetEnumerator());

            var mockFriends = new Mock<DbSet<Friends>>();

            mockFriends.As<IQueryable<Friends>>().Setup(m => m.Provider).Returns(friendsData.Provider);
            mockFriends.As<IQueryable<Friends>>().Setup(m => m.Expression).Returns(friendsData.Expression);
            mockFriends.As<IQueryable<Friends>>().Setup(m => m.ElementType).Returns(friendsData.ElementType);
            mockFriends.As<IQueryable<Friends>>().Setup(m => m.GetEnumerator()).Returns(friendsData.GetEnumerator());
            
            mockDataContext.Setup(m => m.Friends).Returns(mockFriends.Object);

            var results = sut.GetFriendsMarkers(marker1, 1) as OkNegotiatedContentResult<List<Marker>>;
            List<Marker> returnedList = results.Content;

            Assert.AreEqual<int>(2, returnedList.Count);
            Assert.IsTrue(!returnedList.Any(m => m.Experience == "User 4 Experience"));
        }
    }
}
