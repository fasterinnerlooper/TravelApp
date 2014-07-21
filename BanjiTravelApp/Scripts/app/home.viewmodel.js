var dblclickWait = false;
function HomeViewModel(app) {
    var self = this;
    self.user = ko.observable(app.user());
    //Profile Object
    self.map = null;
    self.profile = new ProfileViewModel(self);

    self.markers = ko.observableArray();
    self.pinOptions = ko.observableArray();
    self.breadcrumbs = ko.observableArray([{ latLng: new google.maps.LatLng(0, 0), zoom: 2, name: 'World' }]);
    self.mapOptions = {
        zoom: 2,
        center: new google.maps.LatLng(0, 0),
        disableDefaultUI: true
    };
    self.currentMarker = null;

    self.createMap = function (map) {
        self.map = new google.maps.Map(document.getElementById("map-canvas"),
            self.mapOptions);
        google.maps.event.addListener(self.map, 'click', function (e) {
            dblclickWait = true;
            setTimeout(function () {
                if (dblclickWait) {
                    marker = new google.maps.Marker({
                        position: e.latLng,
                        map: self.map
                    });

                }
            }, 250);
        });

        google.maps.event.addListener(self.map, 'dblclick', function (e) {
            dblclickWait = false;
            breadcrumb = {
                latLng: e.latLng,
                zoom: self.map.getZoom() + 1
            };
            self.addBreadcrumb(breadcrumb);
        });
    };
    


    //methods
    self.addBreadcrumb = function (item) {
        geocoder = new google.maps.Geocoder();
        geocoder.geocode({ 'latLng': item.latLng }, function (result, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                self.setPinOptions(result);
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
                map: self.map
            });
            gmarker.name = marker.name;
            google.maps.event.addListener(gmarker, 'click', function () {
                $('#sidebar').html('<p><strong>Marker Name:</strong> ' + gmarker.name)
            });
        });
    };

    self.setMarkerName = function (name) {
        self.currentMarker.name = name;
        self.addMarker(marker);
    };

    self.addMarker = function (marker) {
        self.markers.push(marker);     
        $.ajax("/api/Marker", {
            type: "POST",
            data: {
                date: Date(),
                latitude: marker.position.lat(),
                longitude: marker.position.lng(),
                name: marker.name,
                profileId: self.profile.profile.profileId
            }
        }).success(function (data) {
            console.dir(data);
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