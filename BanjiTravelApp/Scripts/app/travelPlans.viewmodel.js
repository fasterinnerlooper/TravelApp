function TravelPlansDataModel() {
    var self = this;
    self.url = "api/travelPlans/";
    
    self.plans = null;

    self.getPlans() = function () {
        return $.ajax(profileInfo + self.username);
    }

    self.showAllPastMarkers = function () {
        $.ajax(self.uri, {
            type: "GET",
            data: {
                tense: 'past',
                date: (new Date()).toJSON()
            }
        }).success(function (data) {
            console.dir(data);
        })
    }
};