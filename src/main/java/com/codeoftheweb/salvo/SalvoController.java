package com.codeoftheweb.salvo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class  SalvoController {

    //inyeccion de dependencia (@Autowired), toma algo de otra dependencia
    @Autowired
    private GameRepository gameRepository;

    @Autowired
    private GamePlayerRepository gamePlayerRepository;

    @Autowired
    private PlayerRepository playerRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @GetMapping("/games")
    public Map<String, Object> getGames(Authentication authentication){
        Map<String, Object> dto = new LinkedHashMap<>();
        if (authentication == null || authentication instanceof AnonymousAuthenticationToken){
            dto.put("player", "guest");
        } else {
            dto.put("player", playerRepository.findByUserName(authentication.getName()).toDTO());
        }
        //en lugar de map(Game::toDTO) puede ir map(game->game.toDTO)
        dto.put("games", gameRepository.findAll().stream().map(Game::toDTO).collect(Collectors.toList()));
        return dto;
    }

    // Method to create a new game
    @PostMapping("/games")
    public ResponseEntity<Map<String, Object>> createGames(Authentication authentication) {
        // get current user
        Player player = playerRepository.findByUserName(authentication.getName());
        // new game
        Game newGame = gameRepository.save(new Game(LocalDateTime.now()));
        // new game player
        GamePlayer newGamePlayer = gamePlayerRepository.save(new GamePlayer(newGame, player));
        // create JSON with new id for gameplayer
        return new ResponseEntity<>(makeMap("id", newGamePlayer.getId()), HttpStatus.CREATED);
    }


    // Method to join an existing game
    @PostMapping("/game/{gameId}/players")
    public ResponseEntity<Map<String, Object>> joinGame(@PathVariable Long gameId, Authentication authentication){
        if (authentication == null || authentication instanceof AnonymousAuthenticationToken){
            return new ResponseEntity<>(makeMap("Error", "You must login"), HttpStatus.UNAUTHORIZED);
        }

        if (gameId == null) {
            return new ResponseEntity<>(makeMap("Error", "No such game"), HttpStatus.BAD_REQUEST);
        }

        Game game = gameRepository.getOne(gameId);

        if (game.getGamePlayers().size() > 1) {
            return new ResponseEntity<>(makeMap("Error", "Game is full"), HttpStatus.FORBIDDEN);
        }

        Player player = playerRepository.findByUserName(authentication.getName());
        GamePlayer newGamePlayer = gamePlayerRepository.save(new GamePlayer(game, player));

        return new ResponseEntity<>(makeMap("id", newGamePlayer.getId()), HttpStatus.CREATED);
    }

    // Method to create a new player / indica Error si esta repetido el username o no se completan los parametros username y password
    @PostMapping("/players")
    public ResponseEntity<Map<String, Object>> createPlayer(@RequestParam String username, @RequestParam String password) {
        if (username.isEmpty() || password.isEmpty()) {
            return new ResponseEntity<>(makeMap("Error", "No username"), HttpStatus.FORBIDDEN);
        }
        Player player = playerRepository.findByUserName(username);
        if (player != null) {
            return new ResponseEntity<>(makeMap("Error", "Username in use"), HttpStatus.CONFLICT);
        }
        // tener presente de colocar el passwordEncoder
        Player newPlayer = playerRepository.save(new Player(username, passwordEncoder.encode(password)));
        return new ResponseEntity<>(makeMap("username", newPlayer.getUserName()), HttpStatus.CREATED);
    }

    @GetMapping("/game_view/{gamePlayerId}")
    public ResponseEntity<Map<String, Object>> getGameView (@PathVariable long gamePlayerId, Authentication authentication) {
        GamePlayer gamePlayer = gamePlayerRepository.findById(gamePlayerId).get();
        Player player = playerRepository.findByUserName(authentication.getName());

        if (gamePlayer.getPlayer().getId() == player.getId()) {
            return new ResponseEntity<>(gamePlayer.toGameView(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(makeMap("Error", "You do not have permission to view this game"), HttpStatus.FORBIDDEN);
        }
    }

    private Map<String, Object> makeMap(String key, Object value) {
        Map<String, Object> map = new HashMap<>();
        map.put(key, value);
        return map;
    }

    // Method to add ships
    @PostMapping("games/players/{gamePlayerId}/ships")
    public ResponseEntity<Map<String, Object>> addShips(@PathVariable Long gamePlayerId, Authentication authentication, @RequestBody Set<Ship> ships){
        if (authentication == null || authentication instanceof AnonymousAuthenticationToken){
            return new ResponseEntity<>(makeMap("Error", "There is no current user logged in"), HttpStatus.UNAUTHORIZED);
        }

        if (gamePlayerId == null) {
            return new ResponseEntity<>(makeMap("Error", "No gameplayer with the given ID"), HttpStatus.UNAUTHORIZED);
        }

        GamePlayer gamePlayer = gamePlayerRepository.findById(gamePlayerId).get();
        //gamePlayer.addShips(ships);

        if(!gamePlayer.getPlayer().getUserName().equals(authentication.getName())){
            return new ResponseEntity<>(makeMap("Error", "The current user is not the gameplayer the ID references"), HttpStatus.UNAUTHORIZED);
        }

        if(gamePlayer.getShips().size() != 5){
            return new ResponseEntity<>(makeMap("Error", "The current user does not already have ships placed"), HttpStatus.FORBIDDEN);
        }

        gamePlayer.addShips(ships);
        gamePlayerRepository.save(gamePlayer);
        return  new ResponseEntity<>(gamePlayer.toGameView(), HttpStatus.CREATED);
    }

    // método para agregar las salvas
    @PostMapping("games/players/{gamePlayerId}/salvoes")
    public ResponseEntity<Map<String, Object>> addSalvoes(@PathVariable Long gamePlayerId, Authentication authentication, @RequestBody Salvo salvo){

        if (authentication == null || authentication instanceof AnonymousAuthenticationToken){
            return new ResponseEntity<>(makeMap("Error", "There is no current user logged in"), HttpStatus.UNAUTHORIZED);
        }

        if (gamePlayerId == null) {
            return new ResponseEntity<>(makeMap("Error", "No gameplayer with the given ID"), HttpStatus.UNAUTHORIZED);
        }

        GamePlayer gamePlayer = gamePlayerRepository.findById(gamePlayerId).get();

        if(!gamePlayer.getPlayer().getUserName().equals(authentication.getName())){
            return new ResponseEntity<>(makeMap("Error", "The current user is not the gameplayer the ID references"), HttpStatus.UNAUTHORIZED);
        }

        if(gamePlayer.getSalvoes().stream().anyMatch(gp -> gp.getTurn() == salvo.getTurn()) ){
            return new ResponseEntity<>(makeMap("Error", "The current user has already submitted a salvo for the turn listed"), HttpStatus.FORBIDDEN);
        }

        Set<Salvo> salvoes = new HashSet<>();
        salvoes.add(salvo);
        gamePlayer.addSalvoes(salvoes);
        gamePlayerRepository.save(gamePlayer);
        return new ResponseEntity<>(makeMap("Success", "The salvoes were added and saved"), HttpStatus.CREATED);
    }
}