var dataGrid = {
    "grid_numbers": [1,2,3,4,5,6,7,8,9,10],
    "grid_letters": ["A","B","C","D","E","F","G","H","I","J"]
};

// creacion de las tablas de ships y salvoes con encabezados y filas. Sin jquery tambien se puede escribir: var html = getHeaderHtml(dataGrid); document.getElementById("table-headers").innerHTML = html;
$("#table-headers, #table-headers-salvoes").html(getHeaderHtml(dataGrid));

// creacion de las filas de las tablas de ships y de salvoes
$("#table-rows").html(getRowsHtml(dataGrid));

$("#table-rows-salvoes").html(getRowsHtmlSalvoes(dataGrid));

// funcion que toma el json de la url puesta en el navegador // location.search toma la direccion url del html que esta abierto
$.getJSON("/api/game_view/"+paramObj(location.search), function (data) {
    var players = getPlayers(data);
    $("#player1").html(players.current+" (you)");
    $("#player2").html(players.opponent);
    if (data.ships.length <= 0) {
        createGrid(false);
        grid.addWidget($('<div id="PatrolBoat"><div class="grid-stack-item-content PatrolBoatHorizontal"></div><div/>'), 0, 0, 2, 1, true);
        grid.addWidget($('<div id="Destroyer"><div class="grid-stack-item-content DestroyerHorizontal"></div><div/>'), 0, 0, 3, 1, true);
        grid.addWidget($('<div id="Submarine"><div class="grid-stack-item-content SubmarineHorizontal"></div><div/>'), 0, 0, 3, 1, true);
        grid.addWidget($('<div id="Battleship"><div class="grid-stack-item-content BattleshipHorizontal"></div><div/>'), 0, 0, 4, 1, true);
        grid.addWidget($('<div id="Carrier"><div class="grid-stack-item-content CarrierHorizontal"></div><div/>'), 0, 0, 5, 1, true);
        addWidgetEvent(grid);
        addSalvoEvent(grid);
    } else {
        createGrid(true);
        getShipsAndSalvoes(data);
    }
})

// funcion que genera el encabezado de la grilla (los numeros)
function getHeaderHtml(data) {
    return "<tr><th></th>"+data.grid_numbers.map(number => "<th>"+number+"</th>").join("")+"</tr>";
}
//funcion => tambien es igual a: .map(function (number) { return "<th>"+number+"</th>" })

// funcion que genera el resto de las filas poniendo las grillas de letras en la primer columna haciendo una funcion for (con i)
function getRowsHtml(data) {
    return data.grid_letters.map(function (row, i) {
        return "<tr><th>"+data.grid_letters[i]+"</th>"+getRow(data, i)+"</tr>"
    }).join("");
}

// funcion que genera por fila una cantidad de celdas equivalente a las grillas de numero. Esto luego se agrega a la columna de la grillas de letras. Ademas a cada celda se le da un id con la letra de la fila y el numero de la columna
function getRow(data, i) {
    return data.grid_numbers.map(number => "<td id="+data.grid_letters[i]+number+"></td>").join("");
}

// funcion que genera el resto de las filas de la grilla para salvoes poniendo las grillas de letras en la primer columna haciendo una funcion for (con i)
function getRowsHtmlSalvoes(data) {
    return data.grid_letters.map(function (row, i) {
        return "<tr><th>"+data.grid_letters[i]+"</th>"+getRowSalvoes(data, i)+"</tr>"
    }).join("");
}

// funcion que genera por fila una cantidad de celdas equivalente a las grillas de numero. Esto luego se agrega a la columna de la grillas de letras. Ademas a cada celda se le da un id con la letra de la fila y el numero de la columna con el prefijo salvo- para que se use en la grilla de salvoes y diferenciar del id de la grilla de ships
function getRowSalvoes(data, i) {
    return data.grid_numbers.map(number => "<td id=salvo-"+data.grid_letters[i]+number+"></td>").join("");
}

// funcion que crea un objeto a partir de una url donde toma su ruta de acceso (lo que viene despues de .com por ej)
function paramObj(search) {
    var obj = {};
    var reg = /(?:[?&]([^?&#=]+)(?:=([^&#]*))?)(?:#.*)?/g;

    search.replace(reg, function(match, param, val) {
        obj[decodeURIComponent(param)] = val === undefined ? "" : decodeURIComponent(val);
    });
    return obj.gp;
}

// funcion que toma el numero de gameplayer puesto en el url y lo compara con el id de gameplayer de los players para pasar su email e id. Si no hay oponente, entonces mantiene esa variable como nula
function getPlayers(data) {
    var players = {
        current : null,
        currentId : null,
        opponent : null
    }
    data.gamePlayers.forEach(gamePlayer => {
        if (paramObj(location.search) === gamePlayer.id.toString()){
            players.current = gamePlayer.player.email;
            players.currentId = gamePlayer.player.id;
        }else{
            players.opponent = gamePlayer.player.email;
        }
    })
    return players;
}

// funcion que crea un array de ships propios y otro de salvoes propios y los colorea en la grilla correspondiente. Luego, de acuerdo al id del player determina cuales salvoes son del oponente y los compara con los ships, poniendo a las locaciones en comun el numero de turn y las colorea de naranja
function getShipsAndSalvoes(data) {
    var ownSalvoes = [];
    var playerShips = [];
    // se guardan los players del gameplayer y se usa el id de los player para saber quien es el jugador y quien el oponente
    var players = getPlayers(data);
    // se van agregando uno a uno los ships en su array
    data.ships.forEach(ship => {
        addWidget(ship);
        ship.locations.forEach(loc => playerShips.push(loc))
     });
    addWidgetEvent (grid);
    //funcion usa un forEach para recorrer el array de locacion de buques de un jugador y a cada celda con el id de esas coordenadas les cambia el color
    playerShips.forEach(data => $("#"+data).css("background-color", "darkblue"));
    data.salvoes.forEach(salvo => {
        // para el player del gameplayer se guardan uno a uno los salvoes en su array
        if (salvo.player === players.currentId) {
            salvo.salvoLocations.forEach(loc => ownSalvoes.push(loc) && $("#salvo-"+loc).html(salvo.turn));
            // se le dice al css que las celdas indicadas con el id se deben colorear de naranja
            ownSalvoes.forEach(salvo => $("#salvo-"+salvo).css("background-color", "orange"))
        } else {
            salvo.salvoLocations.forEach(loc => {
                playerShips.forEach(ship => {
                    if (loc === ship) {
                        $("#"+loc).html(salvo.turn);
                        $("#"+loc).css("background-color", "orange");
                    }
                })
            });
        }
    });
}

function addWidget (ship) {
    var searchChar = ship.locations[0].slice(0, 1);
    var secondChar = ship.locations[1].slice(0, 1);
    if (searchChar === secondChar) {
        ship.position = "Horizontal";
    } else {
        ship.position = "Vertical";
    }
    for (var i=0; i < ship.locations.length; i++) {
       ship.locations[i] = ship.locations[i].replace(/A/g, '0');
       ship.locations[i] = ship.locations[i].replace(/B/g, '1');
       ship.locations[i] = ship.locations[i].replace(/C/g, '2');
       ship.locations[i] = ship.locations[i].replace(/D/g, '3');
       ship.locations[i] = ship.locations[i].replace(/E/g, '4');
       ship.locations[i] = ship.locations[i].replace(/F/g, '5');
       ship.locations[i] = ship.locations[i].replace(/G/g, '6');
       ship.locations[i] = ship.locations[i].replace(/H/g, '7');
       ship.locations[i] = ship.locations[i].replace(/I/g, '8');
       ship.locations[i] = ship.locations[i].replace(/J/g, '9');
    }

    var yInGrid = parseInt(ship.locations[0].slice(0, 1));
    var xInGrid = parseInt(ship.locations[0].slice(1, 3)) - 1;

    if (ship.type === "PatrolBoat") {
        if (ship.position === "Horizontal") {
           grid.addWidget($('<div id="PatrolBoat"><div class="grid-stack-item-content PatrolBoatHorizontal"></div><div/>'),
           xInGrid, yInGrid, 2, 1, false);
        } else if (ship.position === "Vertical") {
           grid.addWidget($('<div id="PatrolBoat"><div class="grid-stack-item-content PatrolBoatVertical"></div><div/>'),
           xInGrid, yInGrid, 1, 2, false);
        }
    }

    if (ship.type === "Destroyer") {
        if (ship.position === "Horizontal") {
           grid.addWidget($('<div id="Destroyer"><div class="grid-stack-item-content DestroyerHorizontal"></div><div/>'),
           xInGrid, yInGrid, 3, 1, false);
        } else if (ship.position === "Vertical") {
           grid.addWidget($('<div id="Destroyer"><div class="grid-stack-item-content DestroyerVertical"></div><div/>'),
           xInGrid, yInGrid, 1, 3, false);
        }
    }

    if (ship.type === "Submarine") {
        if (ship.position === "Horizontal") {
           grid.addWidget($('<div id="Submarine"><div class="grid-stack-item-content SubmarineHorizontal"></div><div/>'),
           xInGrid, yInGrid, 3, 1, false);
        } else if (ship.position === "Vertical") {
           grid.addWidget($('<div id="Submarine"><div class="grid-stack-item-content SubmarineVertical"></div><div/>'),
           xInGrid, yInGrid, 1, 3, false);
        }
    }

    if (ship.type === "Battleship") {
        if (ship.position === "Horizontal") {
           grid.addWidget($('<div id="Battleship"><div class="grid-stack-item-content BattleshipHorizontal"></div><div/>'),
           xInGrid, yInGrid, 4, 1, false);
        } else if (ship.position === "Vertical") {
           grid.addWidget($('<div id="Battleship"><div class="grid-stack-item-content BattleshipVertical"></div><div/>'),
           xInGrid, yInGrid, 1, 4, false);
        }
    }

    if (ship.type === "Carrier") {
        if (ship.position === "Horizontal") {
           grid.addWidget($('<div id="Carrier"><div class="grid-stack-item-content CarrierHorizontal"></div><div/>'),
           xInGrid, yInGrid, 5, 1, false);
        } else if (ship.position === "Vertical") {
           grid.addWidget($('<div id="Carrier"><div class="grid-stack-item-content CarrierVertical"></div><div/>'),
           xInGrid, yInGrid, 1, 5, false);
        }
    }
}

function addWidgetEvent(grid){
    $(".grid-stack-item").click(function() {
        var h = parseInt($(this).attr("data-gs-height"));
        var w = parseInt($(this).attr("data-gs-width"));
        var posX = parseInt($(this).attr("data-gs-x"));
        var posY = parseInt($(this).attr("data-gs-y"));

       // Rotate Ships Mechanics...
        if (w>h) {
            if (grid.isAreaEmpty(posX, posY + 1, h, w - 1) && posX + h <= 10 && posY + w <= 10) {
                grid.update($(this), posX, posY, h, w);
                $(this).children('.grid-stack-item-content').removeClass($(this).attr("id") + 'Horizontal');
                $(this).children('.grid-stack-item-content').addClass($(this).attr("id") + 'Vertical');

            } else {
                $(this).effect("shake",{direction: "up", distance: 60, times: 10});
            }
        } else {
            if (grid.isAreaEmpty(posX + 1, posY, h - 1, w) && posX + h <= 10 && posY + w <= 10) {
                grid.update($(this), posX, posY, h, w);
                $(this).children('.grid-stack-item-content').removeClass($(this).attr("id") + 'Vertical');
                $(this).children('.grid-stack-item-content').addClass($(this).attr("id") + 'Horizontal');
            } else {
                $(this).effect("shake",{direction: "left", distance: 50, times: 10});
            }
        }
    });
}

function addSalvoEvent(grid){
    $(".grid-stack-item").click(function() {
//        var h = parseInt($(this).attr("data-gs-height"));
//        var w = parseInt($(this).attr("data-gs-width"));
        var posX = parseInt($(this).attr("data-gs-x"));
        var posY = parseInt($(this).attr("data-gs-y"));
        grid.addWidget($('<div id="Bomb"><div class="grid-stack-item-content Bomb"></div><div/>'), posX, posY, 1, 1, true);
    });
}

$("#logout-btn").click(logout);

function logout (evt){
    evt.preventDefault();
    $.post("/api/logout")
        .done(function(){
            window.location.replace("/web/games.html");
         })
}

function createGrid(staticGrid) {
    var options = {
        //grilla de 10 x 10
        width: 10,
        height: 10,
        //separacion entre elementos (les llaman widgets)
        verticalMargin: 0,
        //altura de las celdas
        cellHeight: 40,
        //deshabilitando el resize de los widgets
        disableResize: true,
        //widgets flotantes
		float: true,
        //removeTimeout: 100,
        //permite que el widget ocupe mas de una columna
        disableOneColumnMode: true,
        //false permite mover, true impide
        staticGrid: staticGrid,
        //activa animaciones (cuando se suelta el elemento se ve más suave la caida)
        animate: true
    }
    //se inicializa el grid con las opciones
    $('.grid-stack').gridstack(options);

    grid = $('#grid').data('gridstack');
};

var data = [];

function addShips(){
    $.post({
        url: "/api/games/players/"+paramObj(location.search)+"/ships",
        data: JSON.stringify(data),
        dataType: "text",
        contentType: "application/json"
    })
    .done(function(){
        alert("Your ships were placed successfully");
    })
    .fail(function(){
        alert("Error: ships could not be placed");
    })
}

$("#place-btn").click(function(){
  $(".grid-stack-item").each(function(){
    var obj = new Object();
    var arr = [];
    if($(this).attr("data-gs-width") != "1"){
      for(var i = 0; i < parseInt($(this).attr("data-gs-width")); i++){
        arr.push(String.fromCharCode(parseInt($(this).attr("data-gs-y"))+65)+(parseInt($(this).attr("data-gs-x"))+i+1).toString());
      }
    } else{
      for(var i = 0; i < parseInt($(this).attr("data-gs-height")); i++){
        arr.push(String.fromCharCode(parseInt($(this).attr("data-gs-y"))+i+65)+(parseInt($(this).attr("data-gs-x"))+1).toString());
      }
    }

    obj.type = $(this).attr("id");
    obj.locations = arr;
    data.push(obj);
  })
  addShips();
});