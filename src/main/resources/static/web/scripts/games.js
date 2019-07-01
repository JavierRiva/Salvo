//busca el json (con jquery) de la url pasada y lo mete en el id lista del html (cumpliendo tambien la funcion getListHtml
$.getJSON( "http://localhost:8080/api/games", function(data) {
    $("#lista").html(getListHtml(data));
    $("#table-rows").html(getRowsHtml(data));
});

//funcion que crea la lista tomando cada item de la funcion getItemHtml
function getListHtml(data) {
    return data.map(getItemHtml).join("");
}

// funcion que crea cada item de la lista, =>es la funcion flecha de map
function getItemHtml(game) {
    return "<li>" + game.created + ": " + game.gamePlayers.map(data => data.player.email).join(" & ") + "</li>"
}

// funcion que genera las filas con sus datos de acuerdo a cada player
function getRowsHtml(data) {
    // array que contiene los players (sin repetir)
    var playersList = getPlayers (data);
    // de acuerdo a cada elemento del array (los players) genera cada fila con los datos para cada celda de acuerdo al orden de los elementos del array generado por la funcion getDataTable
    return playersList.map(function (row, i) {
        return "<tr><td class='first-col'>"+playersList[i]+"</td><td>"+getDataTable(data, playersList[i])[0]+"</td><td>"+getDataTable(data, playersList[i])[1]+"</td><td>"+getDataTable(data, playersList[i])[2]+"</td><td>"+getDataTable(data, playersList[i])[3]+"</td></tr>"
    });
}

// funcion para obtener la lista de los players sin repetirlos
function getPlayers (data) {
    // creo un array vacio para ir agregando los players
    var playersList = [];
    // creo una variable auxiliar booleana. Si está en true me indica que el player no está en el array y por ende lo agrego
    var aux = true;
    // uso un ciclo for. El primer elemento se agrega al array porque está vacío (length = 0). Luego voy comparando los elementos del array con el elemento del ciclo for, si son iguales paso a aux = false. Si permanece true, agrego el elemento al array, sino lo convierto a true para reiniciar el ciclo for.
    data.forEach(data => data.gamePlayers.forEach(gp => {
        if(playersList.length == 0){
            playersList.push(gp.player.email)
        } else {
            playersList.forEach(mail => {
                if (mail == gp.player.email){aux = false;}
            });
            if (aux == true) {playersList.push(gp.player.email)}
            else {aux = true}
        }
    }));
    return playersList;
}

// función para calcular los puntos totales y partidos ganados, perdidos y empatados de un player en particular. Le paso dos parámetros: el json completo y el player (username)
function getDataTable (data, mail) {
    // creo un array vacío donde voy a ir agregando los distintos elementos calculados
    var dataTable = [];
    // creo una variable para la suma con valor inicial 0. Lo mismo para los partidos ganados, perdidos y empatados
    var scoreSum = 0;
    var countWons = 0;
    var countLosts = 0;
    var countTieds = 0;
    // ciclo for que con un if compara cada player del gameplayer con el player ingresado como parámetro. Luego con un switch verifica los 3 casos posibles de scores, cuenta los partidos que cumplen el caso y suma el puntaje correspondiente a la variable de la suma.
    data.forEach(data => data.gamePlayers.forEach(gp => {
        if (gp.player.email == mail){switch (gp.score) {
            case 1:
                countWons++ ;
                scoreSum+=1;
            break;
            case 0:
                countLosts++;
            break;
            case 0.5:
                countTieds++;
                scoreSum+=0.5;
            break;
           }
        }}
     ));
    dataTable.push(scoreSum);
    dataTable.push(countWons);
    dataTable.push(countLosts);
    dataTable.push(countTieds);
    return dataTable;
}