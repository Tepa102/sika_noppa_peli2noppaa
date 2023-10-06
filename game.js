let playerCount;
let players = [];
let currentPlayer = 0;
let currentTurnScore = 0; // Pelaajan nykyisen vuoron pisteet
let rolls = []; // Tässä talletetaan heittojen tulokset
let consecutivePairs = 0; // Tässä seurataan peräkkäisiä pareja
let consecutiveDoublePairs = 0; // Tässä seurataan peräkkäisiä tuplaheittoja
let playerScore = 0; // Pelaajan pisteet

function updateCurrentPlayer() {
  document.getElementById("currentPlayer").textContent = ` ${players[currentPlayer].name}`;
}

function initializeGame() {
  // Tarkistetaan, onko peli jo käynnissä
  if (players.length > 0) {
    let confirmRestart = confirm("Haluatko aloittaa uuden pelin? Nykyinen peli nollataan.");
    if (!confirmRestart) {
      return; // Peliä ei aloiteta uudestaan
    }
  }

  playerCount = parseInt(document.getElementById("playerCount").value);

  if (playerCount < 2 || playerCount > 4) {
    alert("Pelaajien määrän tulee olla 2-4.");
    return;
  }

  // Tyhjennä pelaajalista ja aloita uusi peli
  players = [];
  currentPlayer = 0;
  currentTurnScore = 0;

  for (let i = 0; i < playerCount; i++) {
    let playerName = prompt(`Anna pelaaja ${i + 1} nimi:`);
    players.push({ name: playerName, score: 0 });
  }

  updatePlayerList();
  document.getElementById("game").style.display = "block";
  updateCurrentPlayer();
}

function updatePlayerList() {
  let playerList = document.getElementById("playerList");
  playerList.innerHTML = "";
  players.forEach(player => {
    let li = document.createElement("li");
    li.textContent = `${player.name}: ${player.score} pistettä`;
    playerList.appendChild(li);
    console.log("pelaajien pisteet " + li.textContent)
  });
}

function rollDice() {
  // Tarkista, onko peli jo päättynyt
  if (document.querySelector("button").disabled) {
    return;
  }
  let resultElement = document.getElementById("result");
  let roll1 = Math.floor(Math.random() * 6) + 1;
  let roll2 = Math.floor(Math.random() * 6) + 1;

  document.getElementById("noppaImage").src = `img/noppa${roll1}.gif`;
  document.getElementById("noppaImage2").src = `img/noppa${roll2}.gif`;

  if (roll1 === 1 && roll2 === 1) {
    // Jos heittää 1 ja 1, lisää 25 pistettä
    currentTurnScore += 25;
    resultElement.textContent = `${players[currentPlayer].name} heitti 1 ja 1 ja sai 25 pistettä 
    ja vuoron pisteet ovat nyt ${currentTurnScore}.`;
    console.log(resultElement.textContent)
  } else if (roll1 === roll2 && roll1 === 1) {
    // Jos heittää kolme peräkkäistä tuplaheittoa, menettää vuoron ja pisteet
    currentTurnScore = 0;
    resultElement.textContent = `${players[currentPlayer].name} heitti ${roll1} ja ${roll2} ja menetti pisteitä.`;
    console.log(resultElement.textContent)
    endTurn();
  } else if (roll1 === 1 || roll2 === 1) {
    // Jos toinen noppa näyttää 1, siirry seuraavalle pelaajalle ja nollaa kierroksen pisteet
    currentTurnScore = 0;
    resultElement.textContent = `${players[currentPlayer].name} heitti ${roll1} ja ${roll2} ja menetti pisteitä.`;
    console.log(resultElement.textContent)
    endTurn();
  } else if (roll1 === roll2) {
    currentTurnScore += (roll1 + roll2) * 2;
    resultElement.textContent = `${players[currentPlayer].name} heitti ${roll1} ja ${roll2} ja sai ${(roll1 + roll2) * 2} 
    ja vuoron pisteet ovat nyt ${currentTurnScore}.`;
    console.log(resultElement.textContent)
  } else {
    currentTurnScore += roll1 + roll2;
    resultElement.textContent = `${players[currentPlayer].name} heitti ${roll1} ja ${roll2}, ja sai ${roll1 + roll2}
        ja vuoron pisteet ovat nyt ${currentTurnScore}.`;
    console.log(resultElement.textContent)
  }

  // Kutsutaan tarkistusfunktiota aina kun heitto tapahtuu
  checkConsecutiveDoublePairs(roll1, roll2);
}

// Funktion, joka tarkistaa peräkkäiset tuplaheitot
function checkConsecutiveDoublePairs(roll1, roll2) {
  if (roll1 === roll2 && roll1 !== 1) {
    // Jos heitetään tuplaheitto (ei ykköspari), lisätään laskuria
    consecutiveDoublePairs++;
    console.log(`Peräkkäisiä tuplaheittoja: ${consecutiveDoublePairs}`);

    if (consecutiveDoublePairs === 3) {
      // Jos kolme peräkkäistä tuplaheittoa, siirretään vuoro seuraavalle,
      // nollataan laskuri ja nollataan pelaajan pisteet
      console.log("Kolme peräkkäistä tuplaheittoa! Vuoro siirtyy seuraavalle.");
      consecutiveDoublePairs = 0;
      playerScore = 0; // Nollataan pelaajan pisteet
      endTurn(); // Lopeta vuoro
    }
  } else {
    // Muussa tapauksessa nollataan laskuri
    consecutiveDoublePairs = 0;
  }
}

function endTurn() {
  players[currentPlayer].score += currentTurnScore;
  currentTurnScore = 0; // Nollataan vuoron pisteet

  if (players[currentPlayer].score >= 100) {
    document.getElementById("result").textContent = `${players[currentPlayer].name} voitti! Onneksi olkoon!`;
    document.querySelector("button").disabled = true; // Estä heittämisen lopettaminen voiton jälkeen
    updatePlayerList(); // Päivitä pelaajien pisteet

  } else {
    currentPlayer = (currentPlayer + 1) % playerCount; // Siirry seuraavaan pelaajaan
    updatePlayerList(); // Päivitä pelaajien pisteet
    updateCurrentPlayer(); // Päivitä vuorossa olevan pelaaja
  }
  // Poista "Heitä noppaa" -nappula käytöstä pelin päättyessä
  if (document.querySelector("button").disabled) {
    document.querySelector("button").disabled = true;
  }
}

function startNewGame() {
  playerCount = 0;
  players = [];
  currentPlayer = 0;
  currentTurnScore = 0;

  // Tyhjennä pelaajalista ja nollaa vuorossa oleva pelaaja
  let playerList = document.getElementById("playerList");
  playerList.innerHTML = "";
  document.getElementById("currentPlayer").textContent = "";

  // Nollaa tulostaulu ja aktivoi "Aloita peli" -nappula
  document.getElementById("result").textContent = "";
  document.querySelector("button").disabled = false;

  // Piilota noppakuva ja näytä pelaajien lukumäärän valinta
  document.getElementById("game").style.display = "none";
}
