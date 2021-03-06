window.onload = function (e) {

    const btnStart = document.querySelector("[data-start-game]");
    const myNames = document.querySelectorAll("[data-input-name]");

    function endingGame(matrix) {
        let massage = matrix.getName() + " победил!" + "</br>" + "Игра окончена";

        modalContent.style.display = "none";
        modalTitle.insertAdjacentHTML("afterbegin", massage)
        overlay.style.display = "block";

        setTimeout(function () {
            window.location.reload();
        }, 3000);
    }

    // Сохраняем имя игрока и комьютера

    let userName,
        compName;

    // Проверяем заполнены ли имена на старте нажатием на кнопку
    btnStart.addEventListener("click", function (e) {
        e.preventDefault();
        checkErrorForm(myNames);
    });

    function addText(matrix, text) {
        let massage = matrix.getName() + " " + text + "<br />";
        statusPanel.insertAdjacentHTML("afterbegin", massage);
    };

    // Проверяем заполнены ли имена на старте при вводе в input
    for (let i = 0; myNames.length > i; i++) {
        myNames[i].addEventListener("input", function () {
            checkErrorForm(myNames);
        });
    }

    // Проверяем фомру с именами на ошибки
    function checkErrorForm(arr) {
        let errorList = [];

        for (let i = 0; arr.length > i; i++) {
            removeError(arr[i], "error");
            if (addError(arr[i], "Введите имя", "error") == true) {
                errorList.push("error");
            }
        }

        if (errorList.length == 0) {
            btnStart.classList.remove("disabled");
        } else {
            btnStart.classList.add("disabled");

        }

        errorList = [];

    };

    // Добавляем класс ошибок если есть
    function addError(container, errorMassage, classError) {
        if (container.value == "") {
            const message = document.createElement("div");
            message.classList.add(classError);
            message.insertAdjacentHTML("afterbegin", errorMassage);
            container.parentNode.appendChild(message);
            return true;
        }

    };

    // Удаляем класс ошибок
    function removeError(container, classError) {
        if (container.parentNode.lastChild.className == classError) {
            container.parentNode.removeChild(container.parentNode.lastChild);
        }
    };

    const compNameWrap = document.querySelector("[data-input-name='revertComp']"),
        userNameWrap = document.querySelector("[data-input-name='revertUser']"),
        innerCompName = document.querySelector("[data-name='comp']"),
        innerUserName = document.querySelector("[data-name='user']"),
        overlay = document.querySelector("[data-overlay]"),
        innerStartBtn = document.querySelector("[data-starting-game]"),
        mainContent = document.querySelector("[data-content]"),
        statusPanel = document.querySelector("[data-status-panel]"),
        modalContent = document.querySelector("[data-modal-content]"),
        modalTitle = document.querySelector("[data-modal-title]"),
        matrixSizeWrap = document.querySelector("[data-matrix-size]"),
        controlPanelWrap = document.querySelector("[data-control-panel]"),
        shipsAmount = document.querySelector("[data-ships-amount]");

    matrixSizeWrap.onkeypress = function (e) {
        return false;
    }

    shipsAmount.onkeypress = function (e) {
        return false;
    }

    btnStart.addEventListener("click", function (e) {
        if (!this.classList.contains("disabled")) {
            compName =  userNameWrap.value,
            userName = compNameWrap.value;

            innerCompName.innerHTML = "Ход " + userName;
            innerUserName.innerHTML = "Ход " + compName;
            overlay.style.display = "none";
        }
    });

    const myMatrixWrap = document.querySelector("#myField");
    const compMatrixWrap = document.querySelector("#compField");

    let myMatrix;
    let compMatrix;

    // Максимальное количество короблей на поле
    let maxShip = 20;

    // Кто сейчас ходит
    let myStep = true;

    // Размер игрового поля
    let matrixSize;

    innerStartBtn.addEventListener("click", function () {
        mainContent.classList.remove("hide");
        matrixSize = matrixSizeWrap.value;
        maxShip =  shipsAmount.value;
        controlPanelWrap.style.display = "none";

        // Создаем поле игрока
        myMatrix = new Matrix(myMatrixWrap, matrixSize, matrixSize, userName);
        myMatrix.create();
        myMatrix.hideCells("hidden");

        // Создаем поле компьютера
        compMatrix = new Matrix(compMatrixWrap, matrixSize, matrixSize, compName);
        compMatrix.create();

        // Вызываем рандомную расстановук кораблей
        randomShips(myMatrix);
        randomShips(compMatrix);

        myMatrix.getLiveShip("ship");
        compMatrix.getLiveShip("ship");

        shootings();

        // Начинаем игру
        controlGame();
    });

    // Функция выстрела
    const shoot = function (curt, matrix, e) {

        let fieldAttribute,
            positionHit;

        // Проверяем чей выстрел
        if (myStep) {
            positionHit = e.target.getAttribute("id").split("_");
            fieldAttribute = e.target.getAttribute("data-game");

            matrix.showCell(+positionHit[0], +positionHit[1], "hidden");

        } else {

            // Рандомный выстрел комьютера
            let xCompRandomShoot = +RandomHelp.random(1, matrix.rowsLength);
            let yCompRandomShoot = +RandomHelp.random(1, matrix.colsLength);

            fieldAttribute = matrix.getStatus(xCompRandomShoot, yCompRandomShoot);
            positionHit = [xCompRandomShoot, yCompRandomShoot];

        }

        // Проверяем ранен или убит
        function checkKill(matrix) {
            let i = 1;
            let j = 1;

            while (matrix.getCell(+positionHit[0] - i, +positionHit[1]) != "ship") {
                if (matrix.getCell(+positionHit[0] - i, +positionHit[1]) == "blank" || matrix.getCell(+positionHit[0] - i, +positionHit[1]) == "") {

                    while (matrix.getCell(+positionHit[0] + j, +positionHit[1]) != "ship") {
                        if (matrix.getCell(+positionHit[0] + j, +positionHit[1]) == "blank" || matrix.getCell(+positionHit[0] + j, +positionHit[1]) == "") {
                            addText(matrix, "Уничтожил корабль противника!");
                            return;
                        }
                        j++;
                    }
                    break;
                }
                i++;
            }

            addText(matrix, "ранил корабль противника");
        };

        // Проверяем в какую клетку попали
        switch (fieldAttribute) {
            case "ship":
                matrix.setCell(+positionHit[0], +positionHit[1], "hit");
                checkKill(matrix);
                if (matrix.checkGameStatus() == true) {
                    endingGame(matrix);
                    return;
                }
                break;
            case "hit":
            case "blank":
                if (myStep) {
                    addText(matrix, ",сюда уже стрелял, давай в другую");
                }
                controlGame();
                return;
            default:
                matrix.setCell(+positionHit[0], +positionHit[1], "blank");
                addText(matrix, "промахнулся");
        }

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
    let myShoot;
    let compShoot;

    function shootings() {
        myShoot = shoot.bind(this, e, myMatrix);
        compShoot = shoot.bind(this, e, compMatrix);
    };

    function controlGame() {

        if (myStep) {
            innerCompName.style.color = "blue";
            innerUserName.style.color = "rgba(0,0,0,.87)";
            myMatrixWrap.addEventListener("mousedown", myShoot);

        } else {
            innerUserName.style.color = "blue";
            innerCompName.style.color = "rgba(0,0,0,.87)";
            compMatrixWrap.addEventListener("click", compShoot);

            setTimeout(function () {
                compMatrixWrap.click();
            }, 50);
        }
    };

    //  Рандомно расставляем корабли
    function randomShips(matrix) {
        let xStartShip;
        let yStartShip;
        let shipDeck = 1;

        for (; shipDeck <= maxShip; shipDeck++) {

            xStartShip = RandomHelp.random(1, matrix.rowsLength);
            yStartShip = RandomHelp.random(1, matrix.colsLength);

            function coordShips(x, y, length) {
                let arr = [];
                for (let i = 0; i < length; i++) {
                    arr.push([x + i, y])
                }
                return arr;
            };

            let coordsShip;

            if (shipDeck <= 3) {
                coordsShip = coordShips(xStartShip, yStartShip, 4);
                let fieldChek = clearFieldCheck(matrix, coordsShip, "ship");
                if (!fieldChek) {
                    shipDeck--;
                    continue;
                }
            }

            else if (shipDeck > 3 && shipDeck <= 8) {
                coordsShip = coordShips(xStartShip, yStartShip, 3);
                let fieldChek = clearFieldCheck(matrix, coordsShip, "ship");
                if (!fieldChek) {
                    shipDeck--;
                    continue;
                }
            } else if (shipDeck > 8 && shipDeck <= 14) {
                coordsShip = coordShips(xStartShip, yStartShip, 2);
                let fieldChek = clearFieldCheck(matrix, coordsShip, "ship");
                if (!fieldChek) {
                    shipDeck--;
                    continue;
                }
            } else if (shipDeck > 14 && shipDeck <= maxShip) {
                coordsShip = coordShips(xStartShip, yStartShip, 1);
                let fieldChek = clearFieldCheck(matrix, coordsShip, "ship");
                if (!fieldChek) {
                    shipDeck--;
                    continue;
                }
            }

            createNewShip(matrix, coordsShip);
        }
    };

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



