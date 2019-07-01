var data = {
    "grid_numbers": [1,2,3,4,5,6,7,8,9,10],
    "grid_letters": ["A","B","C","D","E","F","G","H","I","J"]
};

// creacion de las tablas de ships y salvoes con encabezados y filas. Sin jquery tambien se puede escribir: var html = getHeaderHtml(data); document.getElementById("table-headers").innerHTML = html;
$("#table-headers, #table-headers-salvoes").html(getHeaderHtml(data));

// creacion de las filas de las tablas de ships y de salvoes
$("#table-rows").html(getRowsHtml(data));

$("#table-rows-salvoes").html(getRowsHtmlSalvoes(data));

// funcion que toma el json de la url puesta en el navegador // location.search toma la direccion url del html que esta abierto
$.getJSON("http://localhost:8080/api/game_view/"+paramObj(location.search), function (data) {
    var players = getPlayers(data);
    $("#player1").html(players.current+" (you)");
    $("#player2").html(players.opponent);
    getShipsAndSalvoes(data);
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
    data.ships.forEach(ship => ship.locations.forEach(loc => playerShips.push(loc)));
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
                    }})
            });
        }
    });
}



