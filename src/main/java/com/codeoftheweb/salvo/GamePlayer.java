package com.codeoftheweb.salvo;

import org.hibernate.annotations.GenericGenerator;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Set;

import static java.util.stream.Collectors.toList;

@Entity
public class GamePlayer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY , generator = "native")
    @GenericGenerator(name = "native" , strategy = "native")
    private long id;

    @OneToMany(mappedBy = "gamePlayer", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private Set<Ship> ships = new HashSet<>();

    //relaciona un gameplayer con varios salvoes (los pone en una lista y los salva en el repository de salvoes con cascade)
    @OneToMany(mappedBy = "gamePlayer", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private Set<Salvo> salvoes = new HashSet<>();

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "player_id")
    private Player player;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "game_id")
    private Game game;

    public GamePlayer() {}

    public GamePlayer(Game game , Player player, Set<Ship> ships, Set<Salvo> salvoes) {
        this.game = game;
        this.player = player;
        this.addShips(ships);
        this.addSalvoes(salvoes);
    }

    public Map<String, Object> toDTO () {
        Map<String, Object> dto = new LinkedHashMap<String, Object>();
        dto.put("id", this.id);
        //aca no va el mapeo (stream().map...etc porque hay un player por id
        dto.put("player", this.player.toDTO());
        // metodo if para diferenciar el score que es nulo y el que no (a este ultimo se le aplica el metodo toDTO)
        if (this.getScore()==null){
            dto.put("score", null);
        } else {
            dto.put("score", this.getScore().toDTO());
        }
        return dto;
    }

    public Map<String, Object> toGameView () {
        Map<String, Object> dto = new LinkedHashMap<String, Object>();
        dto.put("id", this.game.getId());
        dto.put("created", this.game.getCreationDate());
        dto.put("gamePlayers", this.game.getGamePlayers().stream().map(GamePlayer::toDTO).collect(toList()));
        dto.put("ships", this.ships.stream().map(Ship::toDTO));
        dto.put("salvoes", this.game.getGamePlayers().stream().flatMap(gamePlayer -> gamePlayer.getSalvoes().stream().map(Salvo::toDTO)).collect(toList())); // flatMap se usa para meter un mapa dentro de otro y los presenta como un array dentro de un mapa
        return dto;
    }

    public Player getPlayer() {
        return player;
    }

    public void setPlayer(Player player) {
        this.player = player;
    }

    public Game getGame() {
        return game;
    }

    public void setGame(Game game) {
        this.game = game;
    }

    public long getId() {
        return id;
    }

    public Set<Ship> getShips() {
        return ships;
    }

    public Set<Salvo> getSalvoes() {
        return salvoes;
    }

    public void addShip(Ship ship){
        ship.setGamePlayer(this);
        this.ships.add(ship);
    }

    public void addShips(Set<Ship> ships) {
        ships.forEach(this::addShip);
    }

    public void setShips(Set<Ship> ships) {
        this.ships = ships;
    }

    public void setSalvoes(Set<Salvo> salvoes) {
        this.salvoes = salvoes;
    }

    // metodo para agregar salvo a la lista salvoes
    public void addSalvo(Salvo salvo){
        salvo.setGamePlayer(this);
        this.salvoes.add(salvo);
    }

    // metodo para crear una lista (set) de salvoes
    public void addSalvoes(Set<Salvo> salvoes) {
        salvoes.forEach(this::addSalvo);
    }

    // metodo que toma un score del player del gamePlayer usado
    public Score getScore() {
        return player.getScore(game);
    }
}