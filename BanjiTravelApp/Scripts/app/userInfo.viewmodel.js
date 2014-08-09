function UserInfoViewModel(app, name, dataModel) {
    var self = this;

    // Data
    self.name = ko.observable(name);
    self.friendRequestCount = ko.computed(function () {
        console.log("Inside userinfo viewmodel");
        if (app.home() == null) {
            return 0
        } else {
            var value = app.home().friendRequestCount();
            console.log(value);
            return value;
        }
    });

    // Operations
    self.logOff = function () {
        dataModel.logout().done(function () {
            app.navigateToLoggedOff();
        }).fail(function () {
            app.errors.push("Log off failed.");
        });
    };

    self.manage = function () {
        app.navigateToManage();
    };

    self.findFriend = function () {
        app.home().findFriend();
    };

    self.showFriendRequest = function () {
        app.home().showFriendRequest();
    };

    self.showAllFriends = function () {
        app.home().showAllFriends();
    };
}