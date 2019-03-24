class Matrix {
    constructor(elem, rowsLength = 20, colsLength = 30, name = "Компьютер") {
        this.elem = elem;
        this.cells = [];
        this.rowsLength = rowsLength;
        this.colsLength = colsLength;
        this.name = name;
        this.liveShips = [];
        // this.game = "true";
    }

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

    getCell(x, y) {
        let num = this._calcActiveCell(x, y);
        return this.cells[num];
    };

    setCell(x, y, val) {
        let num = this._calcActiveCell(x, y);
        this.cells[num] = val;
        this.elem.children[num].setAttribute("data-game", val);

    };

    getStatus(x, y) {
        let num = this._calcActiveCell(x, y);
        return this.elem.children[num].getAttribute("data-game");
        // if (nameCell == "ship") {
        //     this.checkGameStatus();
        // }
    }

    _calcActiveCell(x, y) {
        return (y - 1) * this.rowsLength + x - 1;
    };

    getName() {
        return this.name;
    };

    hideCells(val) {
        for (let i = 0; i < this.cells.length; i++) {
            this.elem.children[i].classList.add(val);
        }
    };

    showCell(x, y, val) {
        let num = this._calcActiveCell(x, y);
        this.elem.children[num].classList.remove(val);
    };

    checkGameStatus() {
        this.liveShips.pop();

        if (this.liveShips.length == 0) {
            alert(this.name + "Победил!");
            return true;
        }
    };

    getLiveShip(cellName) {
        this.liveShips = this.cells.filter(function (item) {
            return item == cellName;
        });
    };

};



