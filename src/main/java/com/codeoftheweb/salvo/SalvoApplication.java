package com.codeoftheweb.salvo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

@SpringBootApplication
public class SalvoApplication {

	public static void main(String[] args) {

		SpringApplication.run(SalvoApplication.class, args);
	}

	@Autowired
	PasswordEncoder passwordEncoder;

	//@bean indica que esta para meter algo en la application
	@Bean
	public CommandLineRunner initData(PlayerRepository playerRepository, GameRepository gameRepository, GamePlayerRepository gamePlayerRepository, ShipRepository shipRepository, ScoreRepository scoreRepository) {
		return (args) -> {
			Player player1 = new Player("j.bauer@ctu.gov", passwordEncoder.encode("24"));
			Player player2 = new Player("c.obrian@ctu.gov", passwordEncoder.encode("42"));
			Player player3 = new Player("kim_bauer@gmail.com", passwordEncoder.encode("kb"));
			Player player4 = new Player("t.almeida@ctu.gov", passwordEncoder.encode("mole"));

			Game game1 = new Game(LocalDateTime.now());
			Game game2 = new Game(LocalDateTime.now().plusHours(1));
			Game game3= new Game(LocalDateTime.now().plusHours(2));
			Game game4= new Game(LocalDateTime.now().plusHours(3));
			Game game5= new Game(LocalDateTime.now().plusHours(4));
			Game game6= new Game(LocalDateTime.now().plusHours(5));
			Game game7= new Game(LocalDateTime.now().plusHours(6));
			Game game8= new Game(LocalDateTime.now().plusHours(7));

			Set<Ship> ships1 = new HashSet<>();
			ships1.add(new Ship ("Destroyer", Arrays.asList("H2", "H3", "H4")));
			ships1.add(new Ship ("Submarine", Arrays.asList("E1", "F1", "G1")));
			ships1.add(new Ship ("PatrolBoat", Arrays.asList("B4", "B5")));

			Set<Ship> ships2 = new HashSet<>();
			ships2.add(new Ship ("Destroyer", Arrays.asList("B5", "C5", "D5")));
			ships2.add(new Ship ("PatrolBoat", Arrays.asList("F1", "F2")));

			Set<Ship> ships3 = new HashSet<>();
			ships3.add(new Ship ("Destroyer", Arrays.asList("B5", "C5", "D5")));
			ships3.add(new Ship ("PatrolBoat", Arrays.asList("C6", "C7")));

			Set<Ship> ships4 = new HashSet<>();
			ships4.add(new Ship ("Submarine", Arrays.asList("A2", "A3", "A4")));
			ships4.add(new Ship ("PatrolBoat", Arrays.asList("G6", "H6")));

			Set<Ship> ships5 = new HashSet<>();
			ships5.add(new Ship ("Destroyer", Arrays.asList("B5", "C5", "D5")));
			ships5.add(new Ship ("PatrolBoat", Arrays.asList("C6", "C7")));

			Set<Ship> ships6 = new HashSet<>();
			ships6.add(new Ship ("Submarine", Arrays.asList("A2", "A3", "A4")));
			ships6.add(new Ship ("PatrolBoat", Arrays.asList("G6", "H6")));

			Set<Ship> ships7 = new HashSet<>();
			ships7.add(new Ship ("Destroyer", Arrays.asList("B5", "C5", "D5")));
			ships7.add(new Ship ("PatrolBoat", Arrays.asList("C6", "C7")));

			Set<Ship> ships8 = new HashSet<>();
			ships8.add(new Ship ("Submarine", Arrays.asList("A2", "A3", "A4")));
			ships8.add(new Ship ("PatrolBoat", Arrays.asList("G6", "H6")));

			Set<Ship> ships9 = new HashSet<>();
			ships9.add(new Ship ("Destroyer", Arrays.asList("B5", "C5", "D5")));
			ships9.add(new Ship ("PatrolBoat", Arrays.asList("C6", "C7")));

			Set<Ship> ships10 = new HashSet<>();
			ships10.add(new Ship ("Submarine", Arrays.asList("A2", "A3", "A4")));
			ships10.add(new Ship ("PatrolBoat", Arrays.asList("G6", "H6")));

			Set<Ship> ships11 = new HashSet<>();
			ships11.add(new Ship ("Destroyer", Arrays.asList("B5", "C5", "D5")));
			ships11.add(new Ship ("PatrolBoat", Arrays.asList("C6", "C7")));

			Set<Ship> ships12 = new HashSet<>();
			ships12.add(new Ship ("Destroyer", Arrays.asList("B5", "C5", "D5")));
			ships12.add(new Ship ("PatrolBoat", Arrays.asList("C6", "C7")));

			/*Set<Ship> ships13 = new HashSet<>();
			ships13.add(new Ship ("Submarine", Arrays.asList("A2", "A3", "A4")));
			ships13.add(new Ship ("PatrolBoat", Arrays.asList("G6", "H6")));*/

			Set<Ship> ships13 = new HashSet<>();
			ships13.add(new Ship ("Submarine", Arrays.asList("A2", "A3", "A4")));
			ships13.add(new Ship ("PatrolBoat", Arrays.asList("G6", "G7")));
			ships13.add(new Ship ("Carrier", Arrays.asList("B1", "B2", "B3", "B4", "B5")));
			ships13.add(new Ship ("Battleship", Arrays.asList("F3", "F4", "F5", "F6")));
			ships13.add(new Ship ("Destroyer", Arrays.asList("I1", "I2", "I3")));



			Set<Salvo> salvoes1 = new HashSet<>();
			salvoes1.add(new Salvo (1, Arrays.asList("B5", "C5", "F1")));
			salvoes1.add(new Salvo (2, Arrays.asList("F2", "D5")));

            Set<Salvo> salvoes2 = new HashSet<>();
            salvoes2.add(new Salvo (1, Arrays.asList("B4", "B5", "B6")));
            salvoes2.add(new Salvo (2, Arrays.asList("E1", "H3", "A2")));

			Set<Salvo> salvoes3 = new HashSet<>();
			salvoes3.add(new Salvo (1, Arrays.asList("A2", "A4", "G6")));
			salvoes3.add(new Salvo (2, Arrays.asList("A3", "H6")));

			Set<Salvo> salvoes4 = new HashSet<>();
			salvoes4.add(new Salvo (1, Arrays.asList("B5", "D5", "C7")));
			salvoes4.add(new Salvo (2, Arrays.asList("C5", "C6")));

			Set<Salvo> salvoes5 = new HashSet<>();
			salvoes5.add(new Salvo (1, Arrays.asList("G6", "H6", "A4")));
			salvoes5.add(new Salvo (2, Arrays.asList("A2", "A3", "D8")));

			Set<Salvo> salvoes6 = new HashSet<>();
			salvoes6.add(new Salvo (1, Arrays.asList("H1", "H2", "H3")));
			salvoes6.add(new Salvo (2, Arrays.asList("E1", "F2", "G3")));

			Set<Salvo> salvoes7 = new HashSet<>();
			salvoes7.add(new Salvo (1, Arrays.asList("A3", "A4", "F7")));
			salvoes7.add(new Salvo (2, Arrays.asList("A2", "G6", "H6")));

			Set<Salvo> salvoes8 = new HashSet<>();
			salvoes8.add(new Salvo (1, Arrays.asList("B5", "C6", "H1")));
			salvoes8.add(new Salvo (2, Arrays.asList("C5", "C7", "D5")));

			Set<Salvo> salvoes9 = new HashSet<>();
			salvoes9.add(new Salvo (1, Arrays.asList("A1", "A2", "A3")));
			salvoes9.add(new Salvo (2, Arrays.asList("G6", "G7", "G8")));

			Set<Salvo> salvoes10 = new HashSet<>();
			salvoes10.add(new Salvo (1, Arrays.asList("B5", "B6", "C7")));
			salvoes10.add(new Salvo (2, Arrays.asList("C6", "D6", "E6")));
			salvoes10.add(new Salvo (3, Arrays.asList("H1", "H8")));

			// d para indicar que es double sin necesidad de poner decimal
			Score score1 = new Score(player1, game1, 1d);
			Score score2 = new Score(player2, game1, 0d);
			Score score3 = new Score(player1, game2, 0.5);
			Score score4 = new Score(player2, game2, 0.5);
			Score score5 = new Score(player2, game3, 1d);
			Score score6 = new Score(player4, game3, 0d);
			Score score7 = new Score(player2, game4, 0.5);
			Score score8 = new Score(player1, game4, 0.5);

			playerRepository.save(player1);
			playerRepository.save(player2);
			playerRepository.save(player3);
			playerRepository.save(player4);

			gameRepository.save(game1);
			gameRepository.save(game2);
			gameRepository.save(game3);
			gameRepository.save(game4);
			gameRepository.save(game5);
			gameRepository.save(game6);
			gameRepository.save(game7);
			gameRepository.save(game8);

			gamePlayerRepository.save(new GamePlayer(game1, player1, ships1, salvoes1));
			gamePlayerRepository.save(new GamePlayer(game1, player2, ships2, salvoes2));
			gamePlayerRepository.save(new GamePlayer(game2, player1, ships3, salvoes3));
			gamePlayerRepository.save(new GamePlayer(game2, player2, ships4, salvoes4));
			gamePlayerRepository.save(new GamePlayer(game3, player2, ships5, salvoes5));
			gamePlayerRepository.save(new GamePlayer(game3, player4, ships6, salvoes6));
			gamePlayerRepository.save(new GamePlayer(game4, player2, ships7, salvoes7));
			gamePlayerRepository.save(new GamePlayer(game4, player1, ships8, salvoes8));
			gamePlayerRepository.save(new GamePlayer(game5, player4, ships9, salvoes9));
			gamePlayerRepository.save(new GamePlayer(game5, player1, ships10, salvoes10));
			gamePlayerRepository.save(new GamePlayer(game6, player3, ships11, new HashSet<>()));
			gamePlayerRepository.save(new GamePlayer(game7, player4, new HashSet<>(), new HashSet<>()));
			gamePlayerRepository.save(new GamePlayer(game8, player3, ships12, new HashSet<>()));
			gamePlayerRepository.save(new GamePlayer(game8, player4, ships13, new HashSet<>()));

			scoreRepository.save(score1);
			scoreRepository.save(score2);
			scoreRepository.save(score3);
			scoreRepository.save(score4);
			scoreRepository.save(score5);
			scoreRepository.save(score6);
			scoreRepository.save(score7);
			scoreRepository.save(score8);
		};
	}
}