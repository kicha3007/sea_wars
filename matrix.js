// Основной класс для создания матрицы и управления игрой
class Matrix {
    constructor(elem, rowsLength = 20, colsLength = 30, name = "Компьютер") {
        this.elem = elem;
        this.cells = [];
        this.rowsLength = rowsLength;
        this.colsLength = colsLength;
        this.name = name;
        this.liveShips = [];
    }

    // Метод создания нового игрового поля
    create() {

        let xid = 1;
        let yid = 1;

        for (let i = 0; i < this.rowsLength * this.colsLength; i++) {

            const div = document.createElement("div");
            this.elem.appendChild(div);
            this.cells[i] = "";

            div.setAttribute("data-game", "sea");
            div.setAttribute("id", xid++ + "_" + yid);

            if ((this.cells.length - 1) % this.rowsLength == 0) {
                div.classList.add("row-start");
            }

            if ((this.cells.length) % this.rowsLength == 0) {
                xid = 1;
                yid++;
            }
        }
    };

    // Метод получения активной ячейки
    getCell(x, y) {
        let num = this._calcActiveCell(x, y);
        return this.cells[num];
    };

    // Метод установки значения в ячейку
    setCell(x, y, val) {
        let num = this._calcActiveCell(x, y);
        this.cells[num] = val;
        this.elem.children[num].setAttribute("data-game", val);

    };

    // Метод проверки статуса ячейки
    getStatus(x, y) {
        let num = this._calcActiveCell(x, y);
        return this.elem.children[num].getAttribute("data-game");
    }

    // Приватный метод расчета активной ячейки
    _calcActiveCell(x, y) {
        return (y - 1) * this.rowsLength + x - 1;
    };

    // Получение имени активного пользователя
    getName() {
        return this.name;
    };

    // Скрытие ячеек в поле противника
    hideCells(val) {
        for (let i = 0; i < this.cells.length; i++) {
            this.elem.children[i].classList.add(val);
        }
    };

    // Отображение ячейки в поле противника по которой стреляли
    showCell(x, y, val) {
        let num = this._calcActiveCell(x, y);
        this.elem.children[num].classList.remove(val);
    };

    // Проверка сколько остальось не подбитых кораблей \ окончания игры
    checkGameStatus() {
        this.liveShips.pop();

        if (this.liveShips.length == 0) {
            return true;
        }
    };

    // Изначальное полуение массива активных кораблей
    getLiveShip(cellName) {
        this.liveShips = this.cells.filter(function (item) {
            return item == cellName;
        });
    };

};



