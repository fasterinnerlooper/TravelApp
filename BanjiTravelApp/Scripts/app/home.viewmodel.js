var dblclickWait = false;
function HomeViewModel(app) {
    var self = this;
    self.user = ko.observable(app.user());
    //Profile Object
    self.map = null;
    self.profile = new ProfileViewModel(self);
    self.geocoder = new google.maps.Geocoder();

    self.markers = ko.observableArray();
    self.sidebarTitle = ko.observable();
    self.markerDetails = ko.observable();
    self.pinOptions = ko.observableArray();
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
                self.setPinOptions(result);
                item.name = result[result.length - 1].formatted_address;
                if (item.name != self.breadcrumbs()[self.breadcrumbs().length - 1].name) {
                    self.breadcrumbs.push(item);
                }
            }
        });
    };

    self.setPinOptions = function (result) {
        self.pinOptions.removeAll();
        result.forEach(function (item) {
            self.pinOptions.push(item.formatted_address);
        });
    };

    self.setMarkers = function (markers) {
        markers.forEach(function (marker) {
            gmarker = new google.maps.Marker({
                position: { lat: marker.latitude, lng: marker.longitude },
                map: self.map,
                title: marker.name,
                markerId: marker.markerId,
                experience: marker.experience
            });
            gmarker.name = marker.name;
            //Set up marker click event
            self.giveMarkerClickEvent(gmarker);
        });
    };

    self.giveMarkerClickEvent = function (marker) {
        google.maps.event.addListener(marker, 'click', function () {
            self.sidebarTitle(marker.title);
            self.showMarkerDetails(marker);
            self.openSidebar();
        });
    };

    self.openSidebar = function () {
        $('#sidebar').show().addClass("col-md-3");
    }

    self.setMarkerName = function (name) {
        self.currentMarker.title = name;
        self.infoWindow.setContent(name);
        self.addMarker(self.currentMarker);
        self.giveMarkerClickEvent(self.currentMarker);
        self.currentMarker = null;
        self.pinOptions.removeAll();
    };

    self.showMarkerDetails = function (marker) {
        self.currentMarker = marker;
        self.markerDetails({
            'markerId': marker.markerId,
            'experience': (marker.experience === undefined || marker.experience === null) ? 'Enter your experience here' : marker.experience
        });
    };
    
    self.saveMarkerDetails = function (data) {
        self.currentMarker.experience = data.experience
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
}

app.addViewModel({
    name: "Home",
    bindingMemberName: "home",
    factory: HomeViewModel,
    navigationFactory: function () {
        app.view(app.views.Home);
    }
});

function Marker(marker) {
    var self = this;
    self.markerId = marker.markerId;
    self.latitude = marker.latitude;
    self.longitude = marker.longitude;
    self.name = marker.name;
    self.profileId = marker.profileId;
    self.experience = marker.experience;
    self.likes = marker.likes;
    self.dislikes = marker.dislikes;
}