function TravelPlansViewModel(app) {
    var self = this;
    self.travelPlans = ko.observableArray();
    if (app.user != null) {
        var dataModel = new TravelPlansDataModel(app.user().name)

        dataModel.getPlans()
            .done(function (travelplans) {
                self.travelPlans(travelplans);
                //app.setTravelPlans(travelPlans);
            }).fail(function (data) {
                alert('The call failed, the reported error was ' + data.statusText);
            });
    }
}
function TravelPlansDataModel(username) {
    var self = this;
    self.username = username;
    self.url = "api/travelPlans/";

    self.getPlans = function () {
        return $.ajax(self.url + self.username());
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