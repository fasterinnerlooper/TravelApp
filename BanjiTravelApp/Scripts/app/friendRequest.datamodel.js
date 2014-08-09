function FriendRequestDataModel(app) {
    var self = this;
    self.app = app;
    self.requests = "/api/friendrequest/";

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