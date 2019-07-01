package com.codeoftheweb.salvo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

import static java.util.stream.Collectors.toList;

@RestController
@RequestMapping("/api")
public class SalvoController {

    //inyeccion de dependencia (@Autowired), tomma algo de otra dependencia
    @Autowired
    private GameRepository gameRepository;

    @Autowired
    private GamePlayerRepository gamePlayerRepository;


    @RequestMapping("/games")
    public List<Object> getAll() {
        //en lugar de map(Game::toDTO) puede ir map(game->game.toDTO)
        return gameRepository.findAll().stream().map(Game::toDTO).collect(toList());
    }

    @RequestMapping("/game_view/{gamePlayerId}")
    public Map<String, Object> getGameView (@PathVariable long gamePlayerId) {
        return gamePlayerRepository.findById(gamePlayerId).get().toGameView();
    }
}


