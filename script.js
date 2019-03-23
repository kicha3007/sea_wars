window.onload = function (e) {

    const maxShip = 10;
    let shipDeck = 1;

    const myMatrixWrap = document.querySelector("#myField");
    const myMatrix = new Matrix( myMatrixWrap, 15 , 15);
    myMatrix.create();

    let xStartShip;
    let yStartShip;

    function randomShips(matrix) {

        for( ; shipDeck <= maxShip;  shipDeck++) {

            xStartShip = Helpers.random(1, matrix.rowsLength);
            yStartShip = Helpers.random(1, matrix.colsLength);

            let coordsShip;

            // todo исправить на цикл
            if (shipDeck == 1 ) {
                coordsShip = [[xStartShip, yStartShip], [xStartShip + 1, yStartShip], [xStartShip + 2, yStartShip], [xStartShip + 3, yStartShip]];
                let fieldChek = clearFieldCheck(matrix, coordsShip, "ship");
                if (!fieldChek ) {
                    shipDeck--;
                    continue;
                }
            }

            else if(shipDeck > 1 &&  shipDeck <= 3) {
                coordsShip = [[xStartShip, yStartShip], [xStartShip + 1, yStartShip], [xStartShip + 2, yStartShip]];
                let fieldChek = clearFieldCheck(matrix , coordsShip, "ship");
                if (!fieldChek ) {
                    shipDeck--;
                    continue;
                }
            } else if(shipDeck > 3 &&  shipDeck <= 6) {
                coordsShip = [[xStartShip, yStartShip], [xStartShip + 1, yStartShip]];
                let fieldChek = clearFieldCheck(matrix, coordsShip, "ship");
                if (!fieldChek ) {
                    shipDeck--;
                    continue;
                }
            } else if(shipDeck > 6 &&  shipDeck <= maxShip) {
                coordsShip = [[xStartShip, yStartShip]];
                let fieldChek = clearFieldCheck(matrix, coordsShip, "ship");
                if (!fieldChek ) {
                    shipDeck--;
                    continue;
                }
            }

            createNewShip( matrix, coordsShip );

        };
    };

    randomShips(myMatrix);

    function clearFieldCheck( matrix, arr, fieldName) {
        
        if(matrix.getCell(arr[0][0] -1, arr[0][1] ) != fieldName &&
            matrix.getCell(arr[0][0] -1, arr[0][1] + 1 ) != fieldName &&
            matrix.getCell(arr[0][0] -1, arr[0][1] - 1 ) != fieldName &&
            matrix.getCell(arr[arr.length - 1][0] + 1, arr[arr.length - 1][1]) != fieldName &&
            matrix.getCell(arr[arr.length - 1][0] + 1, arr[arr.length - 1][1] + 1) != fieldName &&
            matrix.getCell(arr[arr.length - 1][0] + 1, arr[arr.length - 1][1] - 1) != fieldName ) {

            return  arr.every(function(item){
                return matrix.getCell(item[0], item[1]) == ""
                    && matrix.getCell(item[0], item[1] + 1) != fieldName
                    && matrix.getCell(item[0], item[1] - 1) != fieldName
                    && item[0] <=  matrix.rowsLength
                    && item[1] <=  matrix.colsLength;

            });
        }
    };




    function createNewShip(  field, coords ) {
        (new Ship( field , coords).show());
    };



    function shoot(e, matrix) {

        var fieldAttribute = e.target.getAttribute("data-game");
        var positionHit = e.target.getAttribute("id").split("_");

        function getNext(matrix, name){
            return matrix.getCell(+positionHit[0] + 1, +positionHit[1]) == name;
        };

        function getPrev(matrix, name){
            return matrix.getCell(+positionHit[0] - 1, +positionHit[1]) == name;
        };

        function checkKill(matrix) {
            let i = 1;
            let j = 1;

            while(matrix.getCell(+positionHit[0] - i, +positionHit[1]) != "ship") {
                if(matrix.getCell(+positionHit[0] - i, +positionHit[1]) == "blank" || matrix.getCell(+positionHit[0] - i, +positionHit[1]) == "") {
                    console.log("пустая");

                    while (matrix.getCell(+positionHit[0] + j, +positionHit[1]) != "ship") {
                        if(matrix.getCell(+positionHit[0] + j, +positionHit[1]) == "blank" || matrix.getCell(+positionHit[0] + j, +positionHit[1]) == "") {
                            alert("Убит!");
                            return;
                        }
                        j++;
                    }
                    break;
                }
                i++;
            };

            alert("ранил")
        };

        switch(fieldAttribute) {
            case "ship":
                matrix.setCell(+positionHit[0], +positionHit[1], "hit");
                checkKill(myMatrix)
                break;
            case "hit":
                break;
            case "blank":
                break;
            default:
                matrix.setCell(+positionHit[0], +positionHit[1], "blank");
        };


    };

    myMatrixWrap.addEventListener("mousedown", function(e)  {
        shoot(e, myMatrix);
    });


};



