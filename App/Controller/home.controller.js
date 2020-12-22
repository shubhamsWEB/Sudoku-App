(function () {
    app.controller('home', homecontroller);
    function homecontroller($location, $rootScope) {
        var vm = this;
        vm.version = $rootScope.version;
        vm.play = function () {
            $location.path('/Dashboard');
        }
    };
})();
