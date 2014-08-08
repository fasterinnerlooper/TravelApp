function FriendRequestDataModel(app) {
    var self = this;
    self.app = app;
    requests = "/api/friendrequest/";

    self.getRequests = function (id) {
        return $.ajax(requests + id);
    };

    self.sendRequest = function (data) {
        return $.ajax(requests, {
            type: "POST",
            data: data
        });
    };
}