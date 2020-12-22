(function () {
    app.controller('sudokuController', sudokucontroller);
    function sudokucontroller($route,$window, localStorageService, $rootScope, $location, $routeParams) {
        var vm = this;
        vm.alternate = true;
        vm.in = 0;
        vm.wrongAns = 0;
        vm.version = $rootScope.version;
        vm.gameover = false;
        vm.blanks = 0;
        vm.difficulty = $routeParams.Dlevel;
        vm.won = false;


        var x;
        var st = 0;

        vm.startstop = function() { /* Toggle StartStop */

            st = st + 1;

            if (st === 1) {
                vm.start();
                document.getElementById("start").innerHTML = "Pause Game";
            } else if (st === 2) {
                document.getElementById("start").innerHTML = "Resume";
                st = 0;
                vm.stop();
            }

        }


        vm.start = function() {
            x = setInterval(timer, 10);
        } /* Start */

        vm.stop = function() {
            clearInterval(x);
        } /* Stop */

        vm.milisec = 0;
        vm.sec = 0; /* holds incrementing value */
        vm.min = 0;
        vm.hour = 0;

        /* Contains and outputs returned value of  function checkTime */

        vm.miliSecOut = 0;
        vm.secOut = 0;
        vm.minOut = 0

        /* Output variable End */


        function timer() {
            /* Main Timer */


            vm.miliSecOut = checkTime(vm.milisec);
            vm.secOut = checkTime(vm.sec);
            vm.minOut = checkTime(vm.min);
            vm.hourOut = checkTime(vm.hour);

            vm.milisec = ++vm.milisec;

            if (vm.milisec === 100) {
                vm.milisec = 0;
                vm.sec = ++vm.sec;
            }

            if (vm.sec == 60) {
                vm.min = ++vm.min;
                vm.sec = 0;
            }

            if (vm.min == 60) {
                vm.min = 0;
                vm.hour = ++vm.hour;

            }


            document.getElementById("sec").innerHTML = vm.secOut;
            document.getElementById("min").innerHTML = vm.minOut;
            document.getElementById("hour").innerHTML = vm.hourOut;

        }


        /* Adds 0 when value is <10 */


        function checkTime(i) {
            if (i < 10) {
                i = "0" + i;
            }
            return i;
        }
        vm.startstop();

        function suduko() {
            var i, j, q, opt, row, spot, weak, current, tmp, badFlag;


            var scramble = function (arr) { //returns array in scrambled order
                var i, len, obj, sorter, rnd, res;
                obj = {};
                sorter = [];
                res = [];
                len = arr.length;
                i = 0;
                while (i < len) {
                    rnd = Math.random() + "";
                    if (obj[rnd]) {
                        continue;
                    }
                    obj[rnd] = arr[i];
                    i++;
                    sorter.push(rnd);
                }
                sorter = sorter.sort();

                for (i = 0; i < len; i++) {
                    res.push(obj[sorter[i]]);
                }

                return res;
            }

            //=================================


            var join = function (a1, a2) { //joins two arrays but strains out duplicate values
                var arr, i, len, v;
                arr = a1.concat(a2);
                len = arr.length;
                for (i = 0; i < len; i++) {
                    v = arr.shift();
                    if (arr.indexOf(v) != -1) {
                        continue;
                    }
                    arr.push(v);
                }
                return arr;
            }

            var getColumn = function (off) { //gets all values in the specified column
                var i, arr, v;
                arr = [];
                for (i = 0; i < 9; i++) {
                    v = q[i][off];
                    if (v != 0) {
                        arr.push(v);
                    }
                }
                return arr;
            }

            var getRow = function (off) {//gets all values in a row
                var i, arr, v;
                arr = [];
                for (i = 0; i < 9; i++) {
                    v = q[off][i];
                    if (v != 0) {
                        arr.push(v);
                    }
                }
                return arr;
            }

            var invert = function (arr) { //gives all values that are NOT in the argument array
                var i, res, b = [1, 2, 3, 4, 5, 6, 7, 8, 9];
                b = scramble(b);
                res = [];
                for (i = 0; i < 9; i++) {
                    if (arr.indexOf(b[i]) == -1) {
                        res.push(b[i]);
                    }
                }
                return res;
            }

            var getGrid = function (col, row) { //gives all the current values in the 3X3 box to which it belongs
                var res, i, j, v;
                jmp = [0, 3, 6, 9];
                res = [];
                col = Math.floor(col / 3);
                col = jmp[col];
                row = Math.floor(row / 3);
                row = jmp[row];

                for (i = row; i < (row + 3); i++) {
                    for (j = col; j < (col + 3); j++) {
                        v = q[i][j];
                        if (res.indexOf(v) == -1 && v != 0) {
                            res.push(v);
                        }
                    }
                }
                return res;
            }

            var getSet = function (c, r) {  //get all current possible valid options for the position
                var a, b, c;
                a = getGrid(c, r);
                b = getRow(r);
                c = getColumn(c);
                a = join(a, b);
                a = join(a, c);
                a = invert(a);
                return a;
            }

            var init = function () { //build the 2D array and set all values to zero
                var i, j;
                q = [];
                for (i = 0; i < 9; i++) {
                    q[i] = [];
                    for (j = 0; j < 9; j++) {
                        q[i][j] = 0;
                    }
                }

            }
            //======== loop until the heuristic provides a valid puzzle
            do {
                init();
                opt = scramble([1, 2, 3, 4, 5, 6, 7, 8, 9]);
                for (i = 0; i < 9; i++) {
                    q[0][i] = opt[i];
                }
                opt = opt.slice(3, 9);
                opt = scramble(opt);

                for (i = 0; i < 3; i++) {
                    q[1][i] = opt[i];
                    q[2][i] = opt[(i + 3)];
                }

                badFlag = false;

                for (row = 1; row < 9; row++) {
                    while (1 == 1) {
                        tmp = getRow(row);
                        if (tmp.length == 9) {
                            break;
                        }
                        weak = 10;
                        for (i = 0; i < 9; i++) {
                            if (q[row][i] != 0) {
                                continue;
                            }
                            tmp = getSet(i, row);
                            if (tmp.length < weak) {
                                weak = tmp.length;
                                spot = i;
                            }
                        }
                        current = getSet(spot, row);
                        if (current.length == 0) {  //heuristic failed--try again
                            badFlag = true;
                            break;
                        }
                        tmp = current.pop();
                        q[row][spot] = tmp;
                    }

                    if (badFlag) {
                        break;
                    }

                } //end of row
            } while (badFlag);

            //==================
            return q;
        }

        
        vm.SudokuBoardSolution = suduko();
        vm.Board = vm.SudokuBoardSolution;
        localStorageService.set('BoardSolution', vm.SudokuBoardSolution);
        vm.makeSudokuBoard = function () {// Creating Sudoku Board with Solution Board
            angular.forEach(vm.Board, function (value, key) {
                for (var i = 0; i < 9; i++) {
                    var arrNum = value[i];
                    if (vm.alternate) {
                        vm.alternate = false;
                        if (arrNum % 2 == 0) {
                            value[i] = 0;
                            vm.blanks = vm.blanks + 1;
                        }
                    } else {
                        vm.alternate = true;
                        if (arrNum % 2 != 0) {
                            value[i] = 0;
                            vm.blanks = vm.blanks + 1;
                        }
                    }
                }
            });
        };
        vm.makeSudokuBoard();   
        localStorageService.set('Board', vm.Board);

        vm.set = function () {
            vm.inputElement = document.activeElement;
        };

        vm.newGame = function () {
            $route.reload();
        };
        vm.reset = function () {
            vm.Puzzle = localStorageService.get('Board');
        }
        $(document).ready(function () {
            $("#puzzle td").click(function () {
                vm.column_num = parseInt($(this).index()) ;
                vm.row_num = parseInt($(this).parent().index());
            });
        });
        vm.setVal = function (num) {
            if (vm.inputElement != null) {
                if (vm.Solution[vm.row_num][vm.column_num] == num) {
                    vm.inputElement.value = num;
                    vm.inputElement.style.color = "#4BB543";
                    vm.blanks = vm.blanks - 1;
                    if (vm.blanks === 0) {
                        vm.won = true;
                        clearInterval(x);
                    }
                } else {
                    vm.inputElement.value = num;
                    vm.inputElement.style.color = "#F00";
                    vm.wrongAns = vm.wrongAns + 1;
                    vm.gameover = true;
                }
            }
        }
        vm.Puzzle = localStorageService.get('Board');
        vm.Solution = localStorageService.get('BoardSolution');

        vm.continue = function () {
            $window.location.reload();
        }
        vm.no = function () {
            $location.path('/Dashboard');
        }

        /*FIREWORKS*/

        var w = window.innerWidth,
            h = window.innerHeight,
            mousePos = {
                x: 400,
                y: 300
            },
            cnv = document.getElementById('canv'),
            $$ = cnv.getContext('2d'),
            parts = [],
            fireworks = [],
            max = 400,
            color = 0;

        // init
        $(document).ready(function () {
            cnv.width = w;
            cnv.height = h;
            setInterval(go, 50);
            setInterval(loop, 800 / 50);
        });

        // update mouse position
        $(document).mousemove(function (e) {
            e.preventDefault();
            mousePos = {
                x: e.clientX,
                y: e.clientY
            };
        });

        $(document).mousedown(function (e) {
            for (var i = 0; i < 5; i++) {
                goFrom(Math.random() * w * 2 / 3 + w / 6);
            }
        });

        function go() {
            goFrom(mousePos.x);
        }

        function goFrom(x) {
            if (fireworks.length < 10) {
                var firework = new Firework(x);
                firework.ecol = Math.floor(Math.random() * 360 / 10) * 10;
                firework.vel.y = Math.random() * -3 - 4;
                firework.vel.x = Math.random() * 6 - 3;
                firework.size = 8;
                firework.shrink = 0.999;
                firework.grav = 0.01;
                fireworks.push(firework);
            }
        }

        function loop() {
            // update screen size
            if (w != window.innerWidth) {
                cnv.width = w = window.innerWidth;
            }
            if (h != window.innerHeight) {
                cnv.height = h = window.innerHeight;
            }

            $$.fillStyle = "rgba(0, 0, 0, 0.05)";
            $$.fillRect(0, 0, w, h);

            var curr_Fireworks = [];

            for (var i = 0; i < fireworks.length; i++) {

                fireworks[i].update();
                fireworks[i].render($$);


                var distance = Math.sqrt(Math.pow(mousePos.x - fireworks[i].pos.x, 2) + Math.pow(mousePos.y - fireworks[i].pos.y, 2));

                var rnd = fireworks[i].pos.y < (h * 2 / 3) ? (Math.random() * 100 <= 1) : false;


                if (fireworks[i].pos.y < h / 5 || fireworks[i].vel.y >= 0 || distance < 50 || rnd) {
                    fireworks[i].explode();
                } else {
                    curr_Fireworks.push(fireworks[i]);
                }
            }

            fireworks = curr_Fireworks;

            var curr_Parts = [];

            for (var i = 0; i < parts.length; i++) {
                parts[i].update();

                if (parts[i].exists()) {
                    parts[i].render($$);
                    curr_Parts.push(parts[i]);
                }
            }

            parts = curr_Parts;

            while (parts.length > max) {
                parts.shift();
            }
        }

        function Part(pos) {
            this.pos = {
                x: pos ? pos.x : 0,
                y: pos ? pos.y : 0
            };
            this.vel = {
                x: 0,
                y: 0
            };
            this.shrink = .97;
            this.size = 2;

            this.frict = 1;
            this.grav = 0;

            this.flick = false;

            this.alpha = 1;
            this.fade = 0;
            this.color = 0;
        }

        Part.prototype.update = function () {

            this.vel.x *= this.frict;
            this.vel.y *= this.frict;

            this.vel.y += this.grav;

            this.pos.x += this.vel.x;
            this.pos.y += this.vel.y;

            this.size *= this.shrink;

            this.alpha -= this.fade;
        };

        Part.prototype.render = function (c) {
            if (!this.exists()) {
                return;
            }

            c.save();

            c.globalCompositeOperation = 'lighter';

            var x = this.pos.x,
                y = this.pos.y,
                r = this.size / 2;

            var grd = c.createRadialGradient(x, y, 0.1, x, y, r);
            grd.addColorStop(0.1, "rgba(255,255,255," + this.alpha + ")");
            grd.addColorStop(0.8, "hsla(" + this.color + ", 100%, 50%, " + this.alpha + ")");
            grd.addColorStop(1, "hsla(" + this.color + ", 100%, 50%, 0.1)");

            c.fillStyle = grd;

            c.beginPath();
            c.arc(this.pos.x, this.pos.y, this.flick ? Math.random() * this.size : this.size, 0, Math.PI * 2, true);
            c.closePath();
            c.fill();

            c.restore();
        };

        Part.prototype.exists = function () {
            return this.alpha >= 0.1 && this.size >= 1;
        };

        function Firework(x) {
            Part.apply(this, [{
                x: x,
                y: h
            }]);

            this.ecol = 0;
        }

        Firework.prototype = new Part();
        Firework.prototype.constructor = Firework;

        Firework.prototype.explode = function () {
            var count = Math.random() * 10 + 80;

            for (var i = 0; i < count; i++) {
                var part = new Part(this.pos);
                var angle = Math.random() * Math.PI * 2;


                var sp = Math.cos(Math.random() * Math.PI / 2) * 15;

                part.vel.x = Math.cos(angle) * sp;
                part.vel.y = Math.sin(angle) * sp;

                part.size = 10;

                part.grav = 0.2;
                part.frict = 0.92;
                part.shrink = Math.random() * 0.05 + 0.93;

                part.flick = true;
                part.color = this.ecol;

                parts.push(part);
            }
        };

        Firework.prototype.render = function (c) {
            if (!this.exists()) {
                return;
            }

            c.save();

            c.globalCompositeOperation = 'lighter';

            var x = this.pos.x,
                y = this.pos.y,
                r = this.size / 2;

            var grd = c.createRadialGradient(x, y, 0.1, x, y, r);
            grd.addColorStop(0.1, "rgba(255, 255, 255 ," + this.alpha + ")");
            grd.addColorStop(1, "rgba(0, 0, 0, " + this.alpha + ")");

            c.fillStyle = grd;

            c.beginPath();
            c.arc(this.pos.x, this.pos.y, this.flick ? Math.random() * this.size / 2 + this.size / 2 : this.size, 0, Math.PI * 2, true);
            c.closePath();
            c.fill();

            c.restore();
        };

    };
})();