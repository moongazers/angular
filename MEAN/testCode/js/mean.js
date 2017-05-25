var comppanyApp = angular.module('comppanyApp', ["ngRoute"]);

comppanyApp.config(function($routeProvider) {
    $routeProvider
    .when("/:id", { // >1.2 new feature
        templateUrl : "templates/edit.html",
        controller: "editCtrl"
    })
    .when("/:id/people", {
        templateUrl : "templates/people.html",
        controller: "peopleCtrl"
    })
    .when("/:id/people/:pid", {
        templateUrl : "templates/person.html",
        controller: "personCtrl"
    })
    .otherwise({
        templateUrl : "templates/list.html",
        controller: "listCtrl"
    });
});

comppanyApp.controller('mainCtrl', function($scope, $http, $route) {

    $scope.companySave = function() {
        //Creates a new Company
        $http.post('/companies/', $scope.company)
        .then(function(response) {
            console.log(response);
            $route.reload();
        }, function(response) {
            console.log("Error " + response.status + ": " + response.statusText);
        });
    };

    $scope.companyClear = function() {
        $scope.company = {};
    };

    //Returns all Companies for select menu in "create a person" part
    $http.get('/companies')
    .then(function(response) {
        $scope.list = response.data;
        console.log(response);
    }, function(response) {
        console.log("Error " + response.status + ": " + response.statusText);
    });

    $scope.personSave = function() {
        console.log($scope.companySelected);
        $scope.person.companyId = $scope.companySelected._id;
        console.log($scope.person);

        //Creates a new Person
        $http.post('/person', $scope.person)
        .then(function(response) {
            console.log(response);
            $scope.personClear();
        }, function(response) {
            console.log("Error " + response.status + ": " + response.statusText);
        });
    };

    $scope.personClear = function() {
        $scope.person = {};
        $scope.companySelected = {};
    };

});

comppanyApp.controller('listCtrl', function($scope, $http, $location) {

    //Returns all Companies
    $http.get('/companies')
    .then(function(response) {
        $scope.list = response.data;
        console.log(response);
    }, function(response) {
        console.log("Error " + response.status + ": " + response.statusText);
    });

    $scope.go = function(obj) {
        $location.path(obj._id);
    };

    $scope.peopleGo = function(obj) {
        $location.path(obj._id + "/people");
    };
});

comppanyApp.controller('editCtrl', function($scope, $http, $routeParams, $location) {
    console.log($routeParams);

    // Returns a single Company
    $http.get('/companies/' + $routeParams.id)
    .then(function(response) {
        $scope.details = response.data;
        console.log(response);
    }, function(response) {
        console.log("Error " + response.status + ": " + response.statusText);
    });

    $scope.save = function() {
        console.log($scope.details);

        //Updates a single company
        $http.put('/companies/'+ $routeParams.id, $scope.details)
        .then(function(response) {
            console.log(response);
        }, function(response) {
            console.log("Error " + response.status + ": " + response.statusText);
        });

    };

    $scope.back = function() {
        $location.path("/");
    };

    $scope.peopleGo = function() {
        console.log($routeParams.id);
        $location.path($routeParams.id + "/people");
    };

});

comppanyApp.controller('peopleCtrl', function($scope, $http, $routeParams, $location, $route) {
    console.log($routeParams);

    // Returns a single Company
    $http.get('/companies/' + $routeParams.id)
    .then(function(response) {
        $scope.details = response.data;
        console.log(response);
    }, function(response) {
        console.log("Error " + response.status + ": " + response.statusText);
    });

    //Returns all People associated to a company
    $http.get('/companies/' + $routeParams.id +'/people')
    .then(function(response) {
        $scope.people = response.data;
        console.log(response);
    }, function(response) {
        console.log("Error " + response.status + ": " + response.statusText);
    });

    $scope.backtoCompanyEdit = function() {
        $location.path($routeParams.id);
    };

    $scope.delPerson = function(person) {
        console.log(person);

        //Deletes a single Person
        $http.delete('/person/' + person._id)
        .then(function(response) {
            $route.reload();
        }, function(response) {
            console.log("Error " + response.status + ": " + response.statusText);
        });
    };

    $scope.gotoPerson = function(person) {
        $location.path("/" + $routeParams.id + "/people/" + person._id);
    };

    //Creates test person data for the given company id
    // $http.get('/importPeopleForCompany/' + $routeParams.id)
    // .then(function(response) {
    //     console.log(response);
    // }, function(response) {
    //     console.log("Error " + response.status + ": " + response.statusText);
    // });
    

});

comppanyApp.controller('personCtrl', function($scope, $http, $routeParams, $location, $route) {
    console.log($routeParams);

    // Returns a single Company
    $http.get('/companies/' + $routeParams.id)
    .then(function(response) {
        $scope.details = response.data;
    }, function(response) {
        console.log("Error " + response.status + ": " + response.statusText);
    });

    // Returns a single Person
    $http.get('/person/' + $routeParams.pid)
    .then(function(response) {
        $scope.person = response.data;
        console.log(response);
    }, function(response) {
        console.log("Error " + response.status + ": " + response.statusText);
    });

    //Returns all Companies for select menu in "create a person" part
    $http.get('/companies')
    .then(function(response) {
        $scope.listInPerson = response.data;
        // pay attention to scope
        // focus on current company
        console.log(response);
        for (var i = 0; i < $scope.listInPerson.length; i++) {
            var obj = $scope.listInPerson[i];
            if (obj._id === $routeParams.id) {
                var key = i;
                break;
            }
        }
        $scope.companySelectedInPerson = $scope.listInPerson[key];
    }, function(response) {
        console.log("Error " + response.status + ": " + response.statusText);
    });

    $scope.personSave = function() {
        $scope.person.companyId = $scope.companySelectedInPerson._id;
        console.log($scope.person);
        
        //Updates a single person
        $http.put('/person/'+ $routeParams.pid, $scope.person)
        .then(function(response) {
            console.log(response);
        }, function(response) {
            console.log("Error " + response.status + ": " + response.statusText);
        });
    };

    $scope.personBack = function() {
        $location.path($routeParams.id + "/people");
    };

    $scope.backtoCompanyEdit = function() {
        $location.path($routeParams.id);
    };

});