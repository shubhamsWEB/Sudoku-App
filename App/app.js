var app = angular.module('Sudoku', ['ngRoute', 'LocalStorageModule']).run(function ($rootScope) { $rootScope.version = 0.2});

app.config(function ($routeProvider) {
    $routeProvider.when('/Home', {
        templateUrl: 'App/Views/home.html',
        controller: 'home',
        controllerAs: 'home'
    });
    $routeProvider.when('/Dashboard', {
        templateUrl: 'App/Views/dashboard.html',
        controller: 'dashboard',
        controllerAs: 'dash'
    });
    $routeProvider.when('/Sudoku/:Dlevel', {
        templateUrl: 'App/Views/sudokuBoard.html',
        controller: 'sudokuController',
        controllerAs: 'board'
    });
    $routeProvider.otherwise({
        redirectTo: '/Home'
    });
});