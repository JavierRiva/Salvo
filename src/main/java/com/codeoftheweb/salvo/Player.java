package com.codeoftheweb.salvo;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import static java.util.stream.Collectors.toList;

@Entity
public class Player {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY , generator = "native")
    @GenericGenerator(name = "native", strategy = "native")
    private long id;

    @OneToMany(mappedBy = "player", fetch = FetchType.EAGER)
    Set<GamePlayer> gamePlayers = new HashSet<>();

    @OneToMany(mappedBy = "player", fetch = FetchType.EAGER)
    Set<Score> scores = new HashSet<>();

    private String userName;

    public Player() {
    }

    public Player(String userName) {
        this.userName = userName;
    }

    public Map<String, Object> toDTO () {
        Map<String, Object> dto = new LinkedHashMap<String, Object>();
        dto.put("id", this.id);
        dto.put("email", this.userName);
        return dto;
    }

    public void addGamePlayer(GamePlayer gamePlayer){
        gamePlayer.setPlayer(this);
        gamePlayers.add(gamePlayer);
    }

    @JsonIgnore
    public List<Game> getGames () {
        return gamePlayers.stream().map(sub -> sub.getGame()).collect(toList());
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public long getId() {
        return id;
    }

    public void setScores(Set<Score> scores) {
        this.scores = scores;
    }

    // metodo que toma el score de la clase Score dando un game como parametro. De cada score toma el primer id que sea igual al id del juego ingresado (en este caso va a haber uno o ninguno), si no hay ninguno retorna un nulo
    public Score getScore(Game game){
        return scores.stream().filter(sco -> sco.getGame().getId()==game.getId()).findFirst().orElse(null);
    }
}



