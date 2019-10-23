package com.codeoftheweb.salvo;

import org.hibernate.annotations.GenericGenerator;

import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Entity
public class  Salvo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY, generator = "native")
    @GenericGenerator(name = "native", strategy = "native")
    private long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "gamePlayer_id")
    private GamePlayer gamePlayer;

    @ElementCollection
    @Column(name="salvoLocations")
    private List<String> salvoLocations = new ArrayList<>();

    //genero atributo turn
    private long turn;

    // genero metodo Salvo (metodo constructor)
    public Salvo () {
    }

    // metodo constructor
    public Salvo(long turn) { // metodo constructor de turn
        this.turn = turn;
    }

    public Salvo(List<String> salvoLocations) { // metodo constructor de salvoLocations
        this.salvoLocations = salvoLocations;
    }

    // detallo metodo constructor Salvo con parametros turn y salvoLocations
    public Salvo(long turn, List<String> salvoLocations) {
        this.turn = turn;
        this.salvoLocations = salvoLocations;
    }

    public Map<String, Object> toDTO () {
        Map<String, Object> dto = new LinkedHashMap<>();
        dto.put("turn", this.turn);
        dto.put("player", this.gamePlayer.getPlayer().getId());
        dto.put("salvoLocations", this.salvoLocations);
        return dto;
    }

    public void setGamePlayer(GamePlayer gamePlayer) { // metodo para tomar datos de clase GamePlayer
        this.gamePlayer = gamePlayer;
    }

    public long getTurn() { // para poder verlos en el rest/salvoes
        return turn;
    }

    public List<String> getSalvoLocations() { // para poder verlos en el rest/salvoes
        return salvoLocations;
    }

}