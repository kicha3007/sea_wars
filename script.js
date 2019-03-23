window.onload = function (e) {

    // Максимальное количество короблей на поле
    const maxShip = 2;

    // Кто сейчас ходит
    let myStep = true;

    // Создаем поле игрока
    const myMatrixWrap = document.querySelector("#myField");
    const myMatrix = new Matrix(myMatrixWrap, 15, 15, "Игрок");
    myMatrix.create();

    // Создаем поле компьютера
    const compMatrixWrap = document.querySelector("#compField");
    const compMatrix = new Matrix(compMatrixWrap, 15, 15, "Копьютер");
    compMatrix.create();

    // Функция выстрела
    const shoot = function (curt, matrix, e) {
        let fieldAttribute,
            positionHit;

        // Проверяем чей выстрел
        if (myStep) {
            positionHit = e.target.getAttribute("id").split("_");
            fieldAttribute = e.target.getAttribute("data-game");
        } else {

            // Рандомный выстрел комьютера
            let xCompRandomShoot = +Helpers.random(1, matrix.rowsLength);
            let yCompRandomShoot = +Helpers.random(1, matrix.colsLength);


            fieldAttribute = matrix.getStatus(xCompRandomShoot, yCompRandomShoot);
            positionHit = [xCompRandomShoot, yCompRandomShoot];

        }

        // Проверяем ранен или убит
        function checkKill(matrix) {
            let i = 1;
            let j = 1;

            while (matrix.getCell(+positionHit[0] - i, +positionHit[1]) != "ship") {
                if (matrix.getCell(+positionHit[0] - i, +positionHit[1]) == "blank" || matrix.getCell(+positionHit[0] - i, +positionHit[1]) == "") {
                    // console.log("пустая");

                    while (matrix.getCell(+positionHit[0] + j, +positionHit[1]) != "ship") {
                        if (matrix.getCell(+positionHit[0] + j, +positionHit[1]) == "blank" || matrix.getCell(+positionHit[0] + j, +positionHit[1]) == "") {
                            // alert("Убит!");
                            return;
                        }
                        j++;
                    }
                    break;
                }
                i++;
            }
            
            console.log("ранил");
        };

        // Проверяем в какую клетку попали
        switch (fieldAttribute) {
            case "ship":
                matrix.setCell(+positionHit[0], +positionHit[1], "hit");
                checkKill(matrix)

                break;
            case "hit":
            case "blank":
                console.log(matrix.getName(), "Ты сюда уже стрелял, давай в другую");
                return;
            default:
                matrix.setCell(+positionHit[0], +positionHit[1], "blank");
        };

        // В зависимости от хода удаляем обрачотчики и перезапускаем ход
        if (myStep) {
            myMatrixWrap.removeEventListener("mousedown", myShoot);
        } else {
            compMatrixWrap.removeEventListener("click", compShoot);
        }

        myStep = !myStep;
        controlGame();
    };

    // Привязываем аргументы к shoot, чтоб можно  было отменять обработчик в дальнейшем
    const myShoot = shoot.bind(this, e, myMatrix);
    const compShoot = shoot.bind(this, e, compMatrix);

    // Начинаем игру
    controlGame();

    function controlGame() {

        if (myStep) {
            myMatrixWrap.addEventListener("mousedown", myShoot);

        } else {

            compMatrixWrap.addEventListener("click", compShoot);

            setTimeout(function () {
                compMatrixWrap.click();
            }, 300);

        }
    };

    //  Рандомно расставляем корабли
    function randomShips(matrix) {
        let xStartShip;
        let yStartShip;
        let shipDeck = 1;

        for (; shipDeck <= maxShip; shipDeck++) {

            xStartShip = Helpers.random(1, matrix.rowsLength);
            yStartShip = Helpers.random(1, matrix.colsLength);

            let coordsShip;

            // todo исправить на цикл
            if (shipDeck == 1) {
                coordsShip = [[xStartShip, yStartShip], [xStartShip + 1, yStartShip], [xStartShip + 2, yStartShip], [xStartShip + 3, yStartShip]];
                let fieldChek = clearFieldCheck(matrix, coordsShip, "ship");
                if (!fieldChek) {
                    shipDeck--;
                    continue;
                }
            }

            else if (shipDeck > 1 && shipDeck <= 3) {
                coordsShip = [[xStartShip, yStartShip], [xStartShip + 1, yStartShip], [xStartShip + 2, yStartShip]];
                let fieldChek = clearFieldCheck(matrix, coordsShip, "ship");
                if (!fieldChek) {
                    shipDeck--;
                    continue;
                }
            } else if (shipDeck > 3 && shipDeck <= 6) {
                coordsShip = [[xStartShip, yStartShip], [xStartShip + 1, yStartShip]];
                let fieldChek = clearFieldCheck(matrix, coordsShip, "ship");
                if (!fieldChek) {
                    shipDeck--;
                    continue;
                }
            } else if (shipDeck > 6 && shipDeck <= maxShip) {
                coordsShip = [[xStartShip, yStartShip]];
                let fieldChek = clearFieldCheck(matrix, coordsShip, "ship");
                if (!fieldChek) {
                    shipDeck--;
                    continue;
                }
            }

            createNewShip(matrix, coordsShip);

        }
    };

    randomShips(myMatrix);
    randomShips(compMatrix);

    // Проверяем чтоб коробли не становились рядом друг с другом
    function clearFieldCheck(matrix, arr, fieldName) {

        if (matrix.getCell(arr[0][0] - 1, arr[0][1]) != fieldName &&
            matrix.getCell(arr[0][0] - 1, arr[0][1] + 1) != fieldName &&
            matrix.getCell(arr[0][0] - 1, arr[0][1] - 1) != fieldName &&
            matrix.getCell(arr[arr.length - 1][0] + 1, arr[arr.length - 1][1]) != fieldName &&
            matrix.getCell(arr[arr.length - 1][0] + 1, arr[arr.length - 1][1] + 1) != fieldName &&
            matrix.getCell(arr[arr.length - 1][0] + 1, arr[arr.length - 1][1] - 1) != fieldName) {

            return arr.every(function (item) {
                return matrix.getCell(item[0], item[1]) == ""
                    && matrix.getCell(item[0], item[1] + 1) != fieldName
                    && matrix.getCell(item[0], item[1] - 1) != fieldName
                    && item[0] <= matrix.rowsLength
                    && item[1] <= matrix.colsLength;

            });
        }
    };

    // Создаем корабли
    function createNewShip(field, coords) {
        (new Ship(field, coords).show());
    };

};



