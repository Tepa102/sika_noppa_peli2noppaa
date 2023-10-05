let playerCount;
let players = [];
let currentPlayer = 0;
let currentTurnScore = 0; // Pelaajan nykyisen vuoron pisteet

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
        console.log("pelaajien pisteet "+li.textContent)
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
        currentTurnScore += (roll1 + roll2)*2; 
        resultElement.textContent = `${players[currentPlayer].name} heitti ${roll1} ja ${roll2} ja sai ${(roll1 + roll2)*2} 
        ja vuoron pisteet ovat nyt ${currentTurnScore}.`;
        console.log(resultElement.textContent)
    } else {
        currentTurnScore += roll1 + roll2;
        resultElement.textContent = `${players[currentPlayer].name} heitti ${roll1} ja ${roll2}, ja sai ${roll1 + roll2}
            ja vuoron pisteet ovat nyt ${currentTurnScore}.`;
            console.log(resultElement.textContent)

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

// Määritellään tarvittavat muuttujat
let rolls = []; // Tässä talletetaan heittojen tulokset
let consecutivePairs = 0; // Tässä seurataan peräkkäisiä pareja

// Funktion, joka tarkistaa peräkkäiset parit
function checkConsecutivePairs() {
  // Lisätään viimeisin heitto rolls-taulukkoon
  rolls.push(roll1, roll2);

  // Rajataan rolls-taulukkoa kolmeen viimeiseen heittoon
  if (rolls.length > 6) {
    rolls.shift(); // Poistetaan vanhin heitto
  }

  // Tarkistetaan, ovatko viimeiset 3 heittoa pareja
  const last3Rolls = rolls.slice(-3); // Otetaan viimeiset 3 heittoa
  if (last3Rolls[0] === last3Rolls[1] && last3Rolls[0] === last3Rolls[2]) {
    // Jos viimeiset 3 heittoa ovat pareja, se on peräkkäisiä pareja
    consecutivePairs++;
    console.log(`Peräkkäisiä pareja: ${consecutivePairs}`);
  } else {
    // Muussa tapauksessa nollataan laskuri
    consecutivePairs = 0;
  }
}

// Kutsutaan tarkistusfunktiota aina kun heitto tapahtuu
if (roll1 === roll2 && roll1 === 1) {
  // Jos heitto on pari ykköstä, nollataan laskuri
  consecutivePairs = 0;
} else {
  // Muussa tapauksessa tarkistetaan peräkkäiset parit
  checkConsecutivePairs();
}
