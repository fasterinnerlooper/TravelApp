function RegisterViewModel(app, dataModel) {
    var self = this;

    // Data
    self.userName = ko.observable("").extend({ required: true });
    self.password = ko.observable("").extend({ required: true });
    self.confirmPassword = ko.observable("").extend({ required: true, equal: self.password });

    // Other UI state
    self.registering = ko.observable(false);
    self.errors = ko.observableArray();
    self.validationErrors = ko.validation.group([self.userName, self.password, self.confirmPassword]);

    
}

app.addViewModel({
    name: "Register",
    bindingMemberName: "register",
    factory: RegisterViewModel
});
