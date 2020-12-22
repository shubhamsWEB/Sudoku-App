(function () {
    app.controller('dashboard', dashboardcontroller);
    function dashboardcontroller(sudokuservice,$rootScope, $location) {
        var vm = this;
        vm.Boards = [];
        vm.Levels = ['EASY', 'MEDIUM', 'HARD'];
        vm.version = $rootScope.version;
        vm.play = function (difficulty) {
            $location.path('/Sudoku/:difficulty');
        };
    };
})();