import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import PrimaryButton from "./components/PrimaryButton";
import "./App.css";

const API = "https://deckofcardsapi.com/api";

const App = () => {
  const [deckId, setDeckId] = useState();
  const [playerDeck, setPlayerDeck] = useState([]);
  const [dealerDeck, setDealerDeck] = useState([]);
  const [winner, setWinner] = useState();
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const gameResult = async () => {
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
    };
    gameResult();
  });

  //convert card value to number
  const getCardVal = (card) => {
    let card_val = card.value;

    if (card_val === "KING" || card_val === "QUEEN" || card_val === "JACK") {
      card_val = 10;
    } else if (card_val === "ACE") {
      card_val = 11;
    } else {
      card_val = parseInt(card_val);
    }
    return card_val;
  };

  //calculate dealer sum
  let cardSumDealer = 0;
  dealerDeck.forEach((card) => {
    let val = getCardVal(card);
    cardSumDealer = cardSumDealer + val;
  });
  console.log("Dealer sum: ", cardSumDealer);
  localStorage.setItem("sum_Dealer", cardSumDealer);

  //calculate player sum
  let cardSumPlayer = 0;
  playerDeck.forEach((card) => {
    let val = getCardVal(card);
    cardSumPlayer = cardSumPlayer + val;
  });
  console.log("Player Sum: ", cardSumPlayer);
  localStorage.setItem("sum_Player", cardSumPlayer);

  //start game
  const dealGame = async () => {
    let player = [];
    let dealer = [];
    let response = await axios.get(`${API}/deck/new/shuffle/?deck_count=6`);

    let deck_id = await response.data.deck_id;
    setDeckId(deck_id);

    let draw = await axios.get(`${API}/deck/${deck_id}/draw/?count=3`);

    player.push(draw.data.cards[0]);
    player.push(draw.data.cards[1]);
    dealer.push(draw.data.cards[2]);
    setDealerDeck(dealer);
    setPlayerDeck(player);
  };

  //reset game and localstorage
  const resetGame = () => {
    localStorage.clear();
    setDealerDeck([]);
    setPlayerDeck([]);
    setDeckId();
    setWinner("");
    setGameOver(false);
  };

  //player new card
  const playerHit = async () => {
    let response = await axios.get(`${API}/deck/new/shuffle/?deck_count=6`);
    let deck_id = await response.data.deck_id;
    setDeckId(deck_id);
    let draw = await axios.get(`${API}/deck/${deck_id}/draw/?count=1`);
    setPlayerDeck((playerDeck) => [...playerDeck, draw.data.cards[0]]);
  };

  //player stands
  const playerStands = async () => {
    let cardsForDealer = playerDeck.length;

    const response = await axios.get(
      `${API}/deck/${deckId}/draw/?count=${cardsForDealer}`
    );
    for (let i = 0; i < cardsForDealer - 1; i++) {
      let dealer_card = await response.data.cards[i];
      setDealerDeck((dealerDeck) => [...dealerDeck, dealer_card]);
    }
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
