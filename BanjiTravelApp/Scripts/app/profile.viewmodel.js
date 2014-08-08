function ProfileViewModel(app) {
    var self = this;
    self.profile = null;
    if (app.user() != null) {
        var dataModel = new ProfileDataModel(app.user().name());

        dataModel.getProfileInfo()
            .done(function (profile) {
                self.profile = profile;
                app.setMarkers(profile.markers);
                ko.utils.arrayForEach(profile.friends, function (friend) {
                    app.setMarkers(friend.rightProfile.markers, app.iconUrls['blue'], friend.rightProfile.displayName);
                })
            }).fail(function (data) {
                alert('The call failed, the reported error was ' + data.statusText);
            });
    }
}

function ProfileDataModel(username) {
    var self = this;
    self.username = username;

    //URLs
    profileInfo = "api/profile/";

    //Operations
    self.getProfileInfo = function () {
        return $.ajax(profileInfo + self.username);
    }
}