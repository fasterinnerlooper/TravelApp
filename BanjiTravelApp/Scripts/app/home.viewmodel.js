var dblclickWait = false;
function HomeViewModel(app) {
    var self = this;
    self.user = ko.observable(app.user());
    //Profile Object
    self.map = null;
    self.profile = new ProfileViewModel(self);
    self.friendRequest = new FriendRequestDataModel(self);
    self.friends = new FriendsDataModel(self);
    self.geocoder = new google.maps.Geocoder();

    self.markers = ko.observableArray();
    self.sidebarTitle = ko.observable();
    self.pinOptions = ko.observableArray();
    self.saving = ko.observable('Save');
    self.iconUrls = {
        red: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
        blue: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
    }

    //View-switching objects
    self.markingMap = ko.observable(false);
    self.markerDetails = ko.observable();
    self.travelPlans = ko.observable();
    self.findingFriend = ko.observable(false);
    self.showFriendForm = ko.observable(false);
    self.friendList = ko.observableArray();
    self.requestList = ko.observableArray();
    self.searchText = ko.observable().extend({ required: true });
    self.friendRequestCount = ko.observable();
    ko.computed(function () {
        if (self.user() !== null) {
            self.friendRequest.getRequests(self.user().name())
            .success(function (data) {
                self.friendRequestCount(data.length);
            });
        }
    });

    self.breadcrumbs = ko.observableArray([{ latLng: new google.maps.LatLng(0, 0), zoom: 2, name: 'World' }]);
    self.mapOptions = {
        zoom: 2,
        center: new google.maps.LatLng(0, 0),
        disableDefaultUI: true
    };
    self.currentMarker = null;

    self.createMap = function (map) {
        if (self.map === null) {
            self.map = new google.maps.Map(document.getElementById("map-canvas"),
                self.mapOptions);
            //set up map click event
            google.maps.event.addListener(self.map, 'click', function (e) {
                if (self.currentMarker != null && self.currentMarker.markerId == null) {
                    self.currentMarker.setMap(null);
                    self.currentMarker = null;
                }
                if (self.infoWindow != null) {
                    self.infoWindow.close();
                }
                dblclickWait = true;
                setTimeout(function () {
                    if (dblclickWait) {
                        self.currentMarker = new google.maps.Marker({
                            position: e.latLng,
                            map: self.map,
                            title: 'Give me a name'
                        });
                        self.infoWindow = new google.maps.InfoWindow({
                            content: 'Use the left sidebar to give me a name'
                        });
                        google.maps.event.addListener(self.infoWindow, 'closeclick', function () {
                            self.closeSidebar();
                            if (self.currentMarker != null) {
                                self.currentMarker.setMap(null);
                                self.currentMarker = null;
                            }
                        });
                        self.infoWindow.open(self.map, self.currentMarker);
                        self.geocoder.geocode({ 'latLng': e.latLng }, function (result, status) {
                            if (status == google.maps.GeocoderStatus.ZERO_RESULTS) {
                                alert("No locations were found close to here, please try again");
                                self.currentMarker.setMap(null);
                                self.currentMarker = null;
                            }
                            if (status == google.maps.GeocoderStatus.OK) {
                                self.setPinOptions(result);
                                self.openSidebar();
                            }
                        });
                    }
                }, 250);
            });

            //Zoom and add to breadcrumbs on map double click
            google.maps.event.addListener(self.map, 'dblclick', function (e) {
                dblclickWait = false;
                breadcrumb = {
                    latLng: e.latLng,
                    zoom: self.map.getZoom() + 1
                };
                self.addBreadcrumb(breadcrumb);
            });
        }
    };



    //methods
    self.addBreadcrumb = function (item) {
        self.geocoder.geocode({ 'latLng': item.latLng }, function (result, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                if (self.markingMap() == true) {
                    self.setPinOptions(result);
                }
                item.name = result[result.length - 1].formatted_address;
                if (item.name != self.breadcrumbs()[self.breadcrumbs().length - 1].name) {
                    self.breadcrumbs.push(item);
                }
            }
        });
    };

    self.setPinOptions = function (result) {
        self.sidebarTitle("Add Marker name");
        self.markingMap(true);
        self.markerDetails(false);
        self.findingFriend(false);
        self.pinOptions.removeAll();
        result.forEach(function (item) {
            self.pinOptions.push(item.formatted_address);
        });
    };

    self.setMarkers = function (markers, iconUrl, friend) {
        if (!iconUrl) iconUrl = self.iconUrls['red'];
        if(!friend) friend = false;
        markers.forEach(function (marker) {
            gmarker = new google.maps.Marker({
                position: { lat: marker.latitude, lng: marker.longitude },
                map: self.map,
                icon: iconUrl,
                title: marker.name,
                markerId: marker.markerId,
                experience: marker.experience,
                likes: marker.likes,
                dislikes: marker.dislikes,
                friend: friend,
            });
            gmarker.name = marker.name;
            //Set up marker click event
            self.giveMarkerClickEvent(gmarker);
        });
    };

    self.giveMarkerClickEvent = function (marker) {
        google.maps.event.addListener(marker, 'click', function () {
            self.saving('Save');
            self.sidebarTitle(marker.title);
            self.findingFriend(false);
            self.showMarkerDetails(marker);
            self.openSidebar();
        });
    };

    self.openSidebar = function () {
        $('#sidebar').stop().animate({ left: '0px' });
        $('#breadcrumb-container').stop().animate({ left: '340px' });
    }

    self.closeSidebar = function () {
        self.markingMap(false);
        $('#breadcrumb-container').stop().animate({ left: '0px' });
        $('#sidebar').stop().animate({ left: '-340px' });
    };

    self.setMarkerName = function (name) {
        self.currentMarker.title = name;
        self.infoWindow.setContent(name);
        self.addMarker(self.currentMarker);
        self.giveMarkerClickEvent(self.currentMarker);
        self.showMarkerDetails(self.currentMarker);
        self.currentMarker = null;
        self.pinOptions.removeAll();
    };

    self.showMarkerDetails = function (marker) {
        self.currentMarker = marker;
        self.markerDetails({
            'markerId': marker.markerId,
            'experience': (marker.experience === undefined || marker.experience === null) ? 'Enter your experience here' : marker.experience,
            'likes': (marker.likes === undefined || marker.experience === null) ? 'Enter your likes here' : marker.likes,
            'dislikes': (marker.dislikes === undefined || marker.dislikes === null) ? 'Enter your dislikes here' : marker.dislikes,
            'friend': marker.friend,
        });
    };

    self.findProfiles = function (form) {
        var request = "api/profilesearch/" + form.ProfileSearch.value;
        $.ajax(request, {
            type: "GET"
        })
        .success(function (data) {
            self.friendList.removeAll();
            if (self.profile.profile.friends == null || self.profile.profile.friends.length == 0) {
                ko.utils.arrayForEach(data, function (item) {
                    item.sentRequest = false;
                });
            } else {
                ko.utils.arrayForEach(data, function (item) {
                    ko.utils.arrayForEach(self.profile.profile.friends, function (friend) {
                        if (friend.username == item.username) {
                            item.sentRequest = true;
                        } else {
                            item.sentRequest = false;
                        }
                    });
                });
            }
            self.friendList(data);
        })
        .fail(function (data) {
            alert("There was an error: " + data.responseText);
        });
    }

    self.sendRequest = function (user) {
        $.ajax("/api/friendRequest", {
            type: "POST",
            data: {
                toUserId: user.profileId,
                fromUserId: self.profile.profile.profileId,
                requestDateTime: (new Date()).toJSON()
            }
        }).success(function (data) {
            alert("Request successfully sent")
        }).fail(function (data) {
            alert("There was an error: " + data.responseText);
        });
    };

    self.acceptRequest = function (user) {
        $.ajax("/api/friendRequest", {
            type: "POST",
            data: {
                toUserId: user.toUserId,
                fromUserId: user.fromUserId,
                requestDateTime: user.requestDateTime
            }
        }).success(function (data) {
            alert("Request accepted")
            self.addFriendMarkers();
        }).fail(function (data) {
            alert("There was an error: " + data.responseText)
        });
    }

    self.addFriendMarkers = function () {
        self.setMarkers(friend.rightProfile.markers, app.iconUrls['blue'], friend.rightProfile.displayName);
    };

    self.saveMarkerDetails = function (data) {
        self.saving('Saving...');
        self.currentMarker.experience = data.experience;
        self.currentMarker.likes = data.likes;
        self.currentMarker.dislikes = data.dislikes;
        $.ajax("/api/Marker/" + data.markerId, {
            type: "PUT",
            data: {
                markerId: self.currentMarker.markerId,
                name: self.currentMarker.name,
                latitude: self.currentMarker.position.lat(),
                longitude: self.currentMarker.position.lng(),
                date: (new Date()).toJSON(),
                experience: self.currentMarker.experience,
                likes: self.currentMarker.likes,
                dislikes: self.currentMarker.dislikes,
                profileId: self.profile.profile.profileId
            }
        }).success(function () {
            self.saving('Saved!');
            setTimeout(function () {
                self.saving('Save');
            }, 2000);
        });
    };

    self.addMarker = function (marker) {
        self.markers.push(marker);
        $.ajax("/api/Marker", {
            type: "POST",
            data: {
                date: (new Date()).toJSON(),
                latitude: marker.position.lat(),
                longitude: marker.position.lng(),
                name: marker.title,
                profileId: self.profile.profile.profileId
            }
        }).success(function (data) {
            console.dir(data);
        }).fail(function (data) {
            //TODO: Find and report *ALL* errors
            errorText = data.responseJSON.modelState['marker.Date'][0];
            alert('Adding the marker failed for the following reason(s): ' + errorText);
        });
    };

    self.goToBreadcrumb = function (item) {
        self.currentCrumb = item;
        itemIndex = self.breadcrumbs.indexOf(item);
        self.breadcrumbs.splice(itemIndex + 1, self.breadcrumbs().length)
        self.map.setCenter(item.latLng);
        self.map.setZoom(item.zoom);
    };

    self.setTravelPlans = function (travelPlans) {
        self.travelPlans(travelPlans);
        self.findingFriend(false);
        self.markingMap(false);
        self.sidebarTitle("Travel Plans");
        self.currentMarker = null;
        self.pinOptions.removeAll();
        self.openSidebar();
    };

    self.findFriend = function () {
        self.findingFriend(true);
        self.showFriendForm(true);
        self.friendList.removeAll();
        self.requestList.removeAll();
        self.markerDetails(false);
        self.markingMap(false);
        self.sidebarTitle("Find Friends");
        self.openSidebar();
    };

    self.showFriendRequest = function () {
        self.findingFriend(true);
        self.showFriendForm(false);
        self.friendList.removeAll();
        self.requestList.removeAll();
        self.markerDetails(false);
        self.markingMap(false);
        self.sidebarTitle("Friend Request Notifications");
        self.friendRequests();
        self.openSidebar();
    };

    self.showAllFriends = function () {
        self.findingFriend(true);
        self.showFriendForm(false);
        self.friendList.removeAll();
        self.requestList.removeAll();
        self.markerDetails(false);
        self.markingMap(false);
        self.sidebarTitle("All Friends");
        self.listAllFriends();
        self.openSidebar();
    }

    self.listAllFriends = function () {
        self.friends.getRequests(self.user().name())
        .success(function (data) {
            var friendList = Array();
            ko.utils.arrayForEach(data, function (item) {
                item.rightProfile.sentRequest = false;
                friendList.push(item.rightProfile);
            });
            self.friendList.removeAll();
            self.friendList(friendList);
        }).fail(function (data) {
            alert("The request failed with the following error: " + data.responseText);
        });
    };

    self.friendRequests = function () {
        self.friendRequest.getRequests(self.user().name())
        .success(function (data) {
            self.friendList.removeAll();
            if (self.profile.profile.friends == null) {
                ko.utils.arrayForEach(data, function (item) {
                    item.sentRequest = false;
                });
            } else {
                ko.utils.arrayForEach(data, function (item) {
                    ko.utils.arrayForEach(self.profile.profile.friends, function (friend) {
                        if (friend.username == item.username) {
                            item.sentRequest = true;
                        } else {
                            item.sentRequest = false;
                        }
                    });
                });
            }
            self.requestList(data);
        })
        .fail(function (data) {
            alert("There was an error: " + data.responseText);
        });
    }
};

app.addViewModel({
    name: "Home",
    bindingMemberName: "home",
    factory: HomeViewModel,
    navigationFactory: function () {
        app.view(app.views.Home);
    }
});

function FriendRequest(request) {
    var self = this;
    self.fromUsername = request.fromUsername;
    self.toUsername = request.toUsername;
    self.datetime = request.datetime;
};