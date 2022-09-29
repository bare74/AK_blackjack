import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import PrimaryButton from "./components/PrimaryButton";
import "./App.css";

const API = "https://deckofcardsapi.com/api";

const App = () => {
  const [playerDeck, setPlayerDeck] = useState([]);
  const [dealerDeck, setDealerDeck] = useState([]);
  const [winner, setWinner] = useState();
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    let sum_Dealer = localStorage.getItem("sum_Dealer");
    let sum_Player = localStorage.getItem("sum_Player");

    if (sum_Player > 21 || sum_Dealer === 21) {
      setWinner("Dealer");
      setGameOver(true);
    }
    if (sum_Player === 21 || (sum_Dealer > 21 && sum_Player < 21)) {
      setWinner("Spiller");
      setGameOver(true);
    }
  });

  //convert card value to number
  const getCardVal = (card) => {
    let cardValue = card.value;

    if (cardValue === "JACK" || cardValue === "QUEEN" || cardValue === "KING") {
      cardValue = 10;
    } else if (cardValue === "ACE") {
      cardValue = 11;
    } else {
      cardValue = parseInt(cardValue);
    }
    return cardValue;
  };

  //calculate dealer sum
  let cardSumDealer = 0;
  dealerDeck.forEach((card) => {
    let value = getCardVal(card);
    cardSumDealer = cardSumDealer + value;
    localStorage.setItem("sum_Dealer", cardSumDealer);
  });

  //calculate player sum
  let cardSumPlayer = 0;
  playerDeck.forEach((card) => {
    let value = getCardVal(card);
    cardSumPlayer = cardSumPlayer + value;
    localStorage.setItem("sum_Player", cardSumPlayer);
  });

  //start game
  const dealGame = async () => {
    let player = [];
    let dealer = [];

    let draw = await axios.get(`${API}/deck/fl47rstjf4v9/draw/?count=3`);

    player.push(draw.data.cards[0]);
    player.push(draw.data.cards[1]);
    dealer.push(draw.data.cards[2]);
    setDealerDeck(dealer);
    setPlayerDeck(player);
  };

  //reset game
  const resetGame = () => {
    setDealerDeck([]);
    setPlayerDeck([]);
    setWinner("");
    setGameOver(false);
    localStorage.clear();
  };

  //player new card
  const playerHit = async () => {
    let draw = await axios.get(`${API}/deck/fl47rstjf4v9/draw/?count=1`);
    setPlayerDeck((playerDeck) => [...playerDeck, draw.data.cards[0]]);
    console.log("Player", draw);
  };

  //player stands
  const playerStands = async () => {
    let draw = await axios.get(`${API}/deck/fl47rstjf4v9/draw/?count=1`);
    setDealerDeck((dealerDeck) => [...dealerDeck, draw.data.cards[0]]);
    console.log(dealerDeck);
  };

  const GameOver = ({ isGameOver }) => {
    if (isGameOver === true) {
      return (
        <div className="container">
          <h1 className="text">{winner} er vinner</h1>
        </div>
      );
    } else {
      return <></>;
    }
  };

  return (
    <div className="App">
      <h1>BlackJack</h1>
      <hr />
      <div>
        <PrimaryButton
          disableBtn={false}
          text={"Start spill"}
          onClick={dealGame}
        />

        <PrimaryButton
          disableBtn={false}
          text={"Nytt kort"}
          onClick={playerHit}
        />

        <PrimaryButton
          disableBtn={false}
          text={"Stå med kort"}
          onClick={playerStands}
        />
        <PrimaryButton
          disableBtn={false}
          text={"Start på nytt!"}
          onClick={resetGame}
        />
      </div>
      <div>
        <h2>Dealer sum:{cardSumDealer}</h2>
        <div className="card">
          {dealerDeck.map((card) => {
            return (
              <div key={card.code}>
                <img
                  src={card.image}
                  alt={card.value}
                  style={{ padding: "10px" }}
                />
              </div>
            );
          })}
        </div>
      </div>
      <br />
      <div>
        <h2>Spiller sum :{cardSumPlayer}</h2>
        <div className="card">
          {playerDeck.map((card) => {
            return (
              <div key={card.code}>
                <img
                  src={card.image}
                  alt={card.value}
                  style={{ padding: "10px" }}
                />
              </div>
            );
          })}
        </div>
        <GameOver isGameOver={gameOver} />
      </div>
      <br />
    </div>
  );
};

export default App;
