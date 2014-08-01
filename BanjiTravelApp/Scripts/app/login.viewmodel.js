function LoginViewModel(app, dataModel) {
    // Private state
    var self = this,
        validationTriggered = ko.observable(false);

    // Private operations
    function initialize() {
        dataModel.getExternalLogins(dataModel.returnUrl, true /* generateState */)
            .done(function (data) {
                self.loadingExternalLogin(false);
                if (typeof (data) === "object") {
                    for (var i = 0; i < data.length; i++) {
                        self.externalLoginProviders.push(new ExternalLoginProviderViewModel(app, data[i]));
                    }
                } else {
                    self.loginerrors.push("An unknown error occurred.");
                }
            }).fail(function () {
                self.loadingExternalLogin(false);
                self.loginerrors.push("An unknown error occurred.");
            });
    }

    // Data
    self.loginuserName = ko.observable("").extend({ required: true });
    self.loginpassword = ko.observable("").extend({ required: true });
    self.loginrememberMe = ko.observable(false);
    self.loginexternalLoginProviders = ko.observableArray();
    self.loginvalidationErrors = ko.validation.group([self.loginuserName, self.loginpassword]);
    self.loginerrors = ko.observableArray();

    self.registeruserName = ko.observable("").extend({ required: true });
    self.registerpassword = ko.observable("").extend({ required: true });
    self.registerconfirmPassword = ko.observable("").extend({ required: true, equal: self.registerpassword });
    self.registervalidationErrors = ko.validation.group([self.registeruserName, self.registerpassword, self.registerconfirmPassword]);
    self.registererrors = ko.observableArray();

    // Other UI state
    self.loadingExternalLogin = ko.observable(true);
    self.loggingIn = ko.observable(false);
    self.registering = ko.observable(false);

    self.hasExternalLogin = ko.computed(function () {
        return self.loginexternalLoginProviders().length > 0;
    });

    // Operations
    self.login = function () {
        self.loginerrors.removeAll();

        if (self.loginvalidationErrors().length > 0) {
            self.loginvalidationErrors.showAllMessages();
            return;
        }

        self.loggingIn(true);

        dataModel.login({
            grant_type: "password",
            username: self.loginuserName(),
            password: self.loginpassword()
        }).done(function (data) {
            self.loggingIn(false);

            if (data.userName && data.access_token) {
                app.navigateToLoggedIn(data.userName, data.access_token, self.loginrememberMe());
            } else {
                self.loginerrors.push("An unknown error occurred.");
            }
        }).failJSON(function (data) {
            self.loggingIn(false);

            if (data && data.error_description) {
                self.loginerrors.push(data.error_description);
            } else {
                self.loginerrors.push("An unknown error occurred.");
            }
        });
    };

    self.register = function () {
        self.registererrors.removeAll();
        if (self.registervalidationErrors().length > 0) {
            self.registervalidationErrors.showAllMessages();
            return;
        }
        self.registering(true);

        dataModel.register({
            userName: self.registeruserName(),
            password: self.registerpassword(),
            confirmPassword: self.registerconfirmPassword()
        }).done(function (data) {
            dataModel.login({
                grant_type: "password",
                username: self.registeruserName(),
                password: self.registerpassword()
            }).done(function (data) {
                self.registering(false);

                if (data.userName && data.access_token) {
                    app.navigateToLoggedIn(data.userName, data.access_token, false /* persistent */);
                } else {
                    self.registererrors.push("An unknown error occurred.");
                }
            }).failJSON(function (data) {
                self.registering(false);

                if (data && data.error_description) {
                    self.registererrors.push(data.error_description);
                } else {
                    self.registererrors.push("An unknown error occurred.");
                }
            });
        }).failJSON(function (data) {
            var errors;

            self.registering(false);
            errors = dataModel.toErrorsArray(data);

            if (errors) {
                self.registererrors(errors);
            } else {
                self.registererrors.push("An unknown error occurred.");
            }
        });
    };

    initialize();
}

function ExternalLoginProviderViewModel(app, data) {
    var self = this;

    // Data
    self.name = ko.observable(data.name);

    // Operations
    self.login = function () {
        sessionStorage["state"] = data.state;
        sessionStorage["loginUrl"] = data.url;
        // IE doesn't reliably persist sessionStorage when navigating to another URL. Move sessionStorage temporarily
        // to localStorage to work around this problem.
        app.archiveSessionStorageToLocalStorage();
        window.location = data.url;
    };
}

app.addViewModel({
    name: "Login",
    bindingMemberName: "login",
    factory: LoginViewModel,
    navigatorFactory: function (app) {
        return function () {
            app.errors.removeAll();
            app.user(null);
            app.view(app.Views.Login);
        };
    }
});
