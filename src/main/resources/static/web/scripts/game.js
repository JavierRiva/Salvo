/* no es necesario si se usa gridstack
// variable para crear grilla de 10x10 - no es necesaria si se usa gridstack
var dataGrid = {
    "grid_numbers": [1,2,3,4,5,6,7,8,9,10],
    "grid_letters": ["A","B","C","D","E","F","G","H","I","J"]
};

// creacion de las tablas de ships y salvoes con encabezados y filas. Sin jquery tambien se puede escribir: var html = getHeaderHtml(dataGrid); document.getElementById("table-headers").innerHTML = html;
$("#table-headers, #table-headers-salvoes").html(getHeaderHtml(dataGrid));

// creacion de las filas de las tablas de ships y de salvoes
$("#table-rows").html(getRowsHtml(dataGrid));
$("#table-rows-salvoes").html(getRowsHtmlSalvoes(dataGrid));

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
*/




// funcion que toma el json de la url puesta en el navegador // location.search toma la direccion url del html que esta abierto
$.getJSON("/api/game_view/"+paramObj(location.search), function (data) {
    var players = getPlayers(data);
    $("#player1").html(players.current+" (you)");
    $("#player2").html(players.opponent);
    if (data.ships.length <= 0) {
        // crea la grilla con los buques a agregar y posicionar
        createGrid(false);
        // addWidget(widget a agregar, x, y, ancho, alto, autoposicionamiento(si es true: x e y son ignorados)) - ver
        grid.addWidget($('<div id="PatrolBoat"><div class="grid-stack-item-content PatrolBoatHorizontal"></div><div/>'), 0, 0, 2, 1, true);
        grid.addWidget($('<div id="Destroyer"><div class="grid-stack-item-content DestroyerHorizontal"></div><div/>'), 0, 0, 3, 1, true);
        grid.addWidget($('<div id="Submarine"><div class="grid-stack-item-content SubmarineHorizontal"></div><div/>'), 0, 0, 3, 1, true);
        grid.addWidget($('<div id="Battleship"><div class="grid-stack-item-content BattleshipHorizontal"></div><div/>'), 0, 0, 4, 1, true);
        grid.addWidget($('<div id="Carrier"><div class="grid-stack-item-content CarrierHorizontal"></div><div/>'), 0, 0, 5, 1, true);
        addWidgetEvent(grid);
        // funcion para agregar un disparo - tiene que ir en otra grilla - falta terminar de implementar bien - ver si tiene que ir o no aca
       // addSalvoEvent(gridSalvo);
    } else {
        // crea la grilla con los buques ya agregados y posicionados
        createGrid(true);
        getShipsAndSalvoes(data);
    }
})

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

// funcion que toma los buques propios y le aplica la funcion addWidget, y que crea un array de salvas propias de los distintos turnos (ownSalvoes) y le aplica la funcion addWidgetSalvo para representar en ambas grillas
function getShipsAndSalvoes(data) {
    var ownSalvoes = [];
    var players = getPlayers(data);
    /* no es necesario si se usa gridstack
    var playerShips = [];
    // se guardan los players del gameplayer y se usa el id de los player para saber quien es el jugador y quien el oponente
    */
    data.ships.forEach(ship => {
        addWidget(ship);
        //ship.locations.forEach(loc => playerShips.push(loc)) - no es necesario si se usa gridstack
     });
    data.salvoes.forEach(salvo => {
        // para el player del gameplayer se guardan uno a uno los salvoes en su array
        if (salvo.player === players.currentId) {
            salvo.salvoLocations.forEach(loc => ownSalvoes.push(loc))
        }
    })
    addWidgetSalvo(ownSalvoes);

    /* no es necesario si se usa gridstack
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
    */
}

// funcion que agrega los buques en la grilla de acuerdo a sus coordenadas (ship.location) y tipo (ship.type)
function addWidget (ship) {
    var searchChar = ship.locations[0].slice(0, 1);
    var secondChar = ship.locations[1].slice(0, 1);
    // determinacion de la orientacion del buque - si primer letra de las dos primeras coordenadas son iguales entonces la posicion es horizontal sino vertical
    if (searchChar === secondChar) {
        ship.position = "Horizontal";
    } else {
        ship.position = "Vertical";
    }
    // ciclo for para reemplazar las letras de las coordenadas por numeros para un posterior uso correcto con gridstack
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
    // creacion de variables para posicionamiento vertical (yInGrid) y horizontal (xInGrid) de la primer coordenada
    var yInGrid = parseInt(ship.locations[0].slice(0, 1));
    var xInGrid = parseInt(ship.locations[0].slice(1, 3)) - 1; // -1 porque el primer elemento debe ser 0

    // agregado de cada buque de acuerdo a su tipo y su orientacion
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

function addWidgetSalvo(salvo) {
    // ciclo for para reemplazar las letras de las coordenadas por numeros para un posterior uso correcto con gridstack
    for (var i=0; i < salvo.length; i++) {
       salvo[i] = salvo[i].replace(/A/g, '0');
       salvo[i] = salvo[i].replace(/B/g, '1');
       salvo[i] = salvo[i].replace(/C/g, '2');
       salvo[i] = salvo[i].replace(/D/g, '3');
       salvo[i] = salvo[i].replace(/E/g, '4');
       salvo[i] = salvo[i].replace(/F/g, '5');
       salvo[i] = salvo[i].replace(/G/g, '6');
       salvo[i] = salvo[i].replace(/H/g, '7');
       salvo[i] = salvo[i].replace(/I/g, '8');
       salvo[i] = salvo[i].replace(/J/g, '9');

       // creacion de variables para posicionamiento vertical (yInGrid) y horizontal (xInGrid)
       var yInGrid = parseInt(salvo[i].slice(0, 1));
       var xInGrid = parseInt(salvo[i].slice(1, 3)) - 1; // -1 porque el primer elemento debe ser 0
       // agregado en la grilla de cada disparo
       gridSalvo.addWidget($('<div id="Bomb"><div class="grid-stack-item-content Bomb"></div><div/>'), xInGrid, yInGrid, 1, 1, false);
    }
}

// funcion para rotar los buques si se estan agregando
function addWidgetEvent(grid){
    $(".grid-stack-item").click(function() {
        var h = parseInt($(this).attr("data-gs-height"));
        var w = parseInt($(this).attr("data-gs-width"));
        var posX = parseInt($(this).attr("data-gs-x"));
        var posY = parseInt($(this).attr("data-gs-y"));

       // rotacion de buques
       // si esta en posicion horizontal
        if (w>h) {
            if (grid.isAreaEmpty(posX, posY + 1, h, w - 1) && posX + h <= 10 && posY + w <= 10) {
                grid.update($(this), posX, posY, h, w);
                $(this).children('.grid-stack-item-content').removeClass($(this).attr("id") + 'Horizontal');
                $(this).children('.grid-stack-item-content').addClass($(this).attr("id") + 'Vertical');

            } else {
                $(this).effect("shake",{direction: "up", distance: 60, times: 10});
            }
        // si esta en posicion vertical
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

// revisar bien esta funcion y evaluar su necesidad
function addSalvoEvent(gridSalvo){
    $(".grid-stack-item").click(function() {
//        var h = parseInt($(this).attr("data-gs-height"));
//        var w = parseInt($(this).attr("data-gs-width"));
        var posX = parseInt($(this).attr("data-gs-x"));
        var posY = parseInt($(this).attr("data-gs-y"));
        gridSalvo.addWidget($('<div id="Bomb"><div class="grid-stack-item-content Bomb"></div><div/>'), posX, posY, 1, 1, true);
    });
}

$("#logout-btn").click(logout);

//falta comentar
function logout (evt){
    evt.preventDefault();
    $.post("/api/logout")
        .done(function(){
            window.location.replace("/web/games.html");
         })
}

// funcion para crear la grilla - cuando hay que agregar buques nuevos -> staticGrid=false, si ya estan agregados es true (no se los podra mover)
function createGrid(staticGrid) {
    // para options ver gridstack.js API options
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

    grid = $('#grid-ship').data('gridstack');
    gridSalvo = $('#grid-salvo').data('gridstack');
};

//  falta comentar
var data = [];

// falta comentar este metodo
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

// falta estudiar bien este metodo y comentarlo
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

$('#add-shoot-btn').click(function(){
    gridSalvo.addWidget($('<div id="Bomb"><div class="grid-stack-item-content Bomb"></div><div/>'), 0, 0, 1, 1, true);;
});

/* falta:
-cambiar nombre de los grid a gridShip y analogamente con los metodos relacionados
-implementar forma para que pueda mover los disparos agregados con boton add-shoot pero no los de turnos anteriores
-ver y comentar los metodos que faltan (estan marcados)
-implementar metodos para enviar datos al servidor al clickear los botones correspondientes (tener en cuenta el turno en el envio de salvas)
-implementar metodo para borrar disparo con un click en caso de asi quererlo (antes de enviar la salva)
*/