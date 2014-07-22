function ProfileViewModel(app) {
    var self = this;
    self.profile = null;
    if (app.user() != null) {
        var dataModel = new ProfileDataModel(app.user().name());

        dataModel.getProfileInfo()
            .done(function (profile) {
                self.profile = profile;
                app.setMarkers(profile.markers);
            }).fail(function (data) {
                alert('The call failed, the reported error was ' + data.statusText);
            });

        //var travelPlansDataModel = new TravelPlansDataModel(self.profile.profileId);

        //travelPlansDataModel.getPlans()
        //.done(function (travelPlans) {

        //}).fail(function (data) {
        //    alert('The call failed, the reported error was ' + data.statusText);
        //});
    }
}

function ProfileDataModel(username) {
    var self = this;
    self.username = username;
    self.markers = ko.observableArray();

    //URLs
    profileInfo = "api/profile/";

    //Operations
    self.getProfileInfo = function () {
        return $.ajax(profileInfo + self.username);
    }
}