function TravelPlansDataModel() {
    var self = this;
    self.url = "/travelPlans/";
    

    self.plans = null;

    self.getPlans() = function () {        
        return $.ajax(profileInfo + self.username);
    }

}