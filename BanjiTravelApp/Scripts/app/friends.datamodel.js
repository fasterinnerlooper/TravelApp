function FriendsDataModel(app) {
    var self = this;
    self.app = app;
    self.requests = "/api/friends/";

    self.getRequests = function (id) {
        return $.ajax(self.requests + id);
    };

    self.sendRequest = function (data) {
        return $.ajax(self.requests, {
            type: "POST",
            data: data
        });
    };
}