let gameMode = "cpu"; // default mode
let aPendingChoice = "";
let playerOneScore = 0;
let playerTwoScore = 0;
let ties = 0;

// --- CPU API ---
const aCpuApiUrl = rpslsnewon3xj26-ebade4bcbnc4bvbh.westus3-01.azurewebsites.net;

// --- DOM Elements ---
const aBtnModeCpu = document.getElementById("btnModeCpu");
const aBtnModePvp = document.getElementById("btnModePvp");
const aModeHint = document.getElementById("modeHint");

const aP1PickEl = document.getElementById("p1Pick");
const aP2PickEl = document.getElementById("p2Pick");
const aRoundResultEl = document.getElementById("roundResult");

const aP2Section = document.getElementById("p2Section");
const aP2Hint = document.getElementById("p2Hint");

const aP1ScoreEl = document.getElementById("p1Score");
const aP2ScoreEl = document.getElementById("p2Score");
const aTiesEl = document.getElementById("ties");

const aBtnPlayAgain = document.getElementById("btnPlayAgain");
const aBtnReset = document.getElementById("btnReset");

// Player 1 buttons
const buttonsP1 = {
  rock: document.getElementById("btnP1Rock"),
  paper: document.getElementById("btnP1Paper"),
  scissors: document.getElementById("btnP1Scissors"),
  lizard: document.getElementById("btnP1Lizard"),
  spock: document.getElementById("btnP1Spock")
};

// Player 2 buttons
const buttonsP2 = {
  rock: document.getElementById("btnP2Rock"),
  paper: document.getElementById("btnP2Paper"),
  scissors: document.getElementById("btnP2Scissors"),
  lizard: document.getElementById("btnP2Lizard"),
  spock: document.getElementById("btnP2Spock")
};

// --- RULES ---
const RULES = {
  rock: ["scissors", "lizard"],
  paper: ["rock", "spock"],
  scissors: ["paper", "lizard"],
  lizard: ["paper", "spock"],
  spock: ["scissors", "rock"]
};

// --- MODE SWITCH ---
function aSetMode(mode) {
  gameMode = mode;
  aPendingChoice = "";
  aClearPicksUI();

  if (mode === "cpu") {
    aBtnModeCpu.classList.add("isActive");
    aBtnModePvp.classList.remove("isActive");
    aP2Section.style.display = "none";
    aModeHint.textContent = "You are playing against the CPU.";
  } else {
    aBtnModePvp.classList.add("isActive");
    aBtnModeCpu.classList.remove("isActive");
    aP2Section.style.display = "block";
    aModeHint.textContent = "Player 1 picks first.";
    aP2Hint.textContent = "Waiting for Player 1...";
  }
}

// --- UI HELPERS ---
function aClearPicksUI() {
  aP1PickEl.textContent = "-";
  aP2PickEl.textContent = "-";
  aRoundResultEl.textContent = "Make your choice!";
}

function aUpdateScoresUI() {
  aP1ScoreEl.textContent = playerOneScore;
  aP2ScoreEl.textContent = playerTwoScore;
  aTiesEl.textContent = ties;
}

// --- FETCH CPU MOVE ---
function aGetCpuChoiceFromAPi() {
  return fetch(aCpuApiUrl)
    .then(res => res.json())
    .then(data => data.cpuMove.toLowerCase())
    .catch(err => {
      console.error("CPU API error:", err);
      // fallback random CPU if API fails
      const choices = ["rock","paper","scissors","lizard","spock"];
      return choices[Math.floor(Math.random()*choices.length)];
    });
}

// --- DETERMINE WINNER ---
function aDetermineWinner(p1, p2) {
  if (p1 === p2) return "tie";
  if (RULES[p1].includes(p2)) return "player1";
  return "player2";
}

// --- PLAY ROUND ---
function aBtnPlayRound(p1, p2) {
  aP1PickEl.textContent = p1;
  aP2PickEl.textContent = p2;

  const winner = aDetermineWinner(p1, p2);

  if (winner === "tie") {
    ties++;
    aRoundResultEl.textContent = "It's a tie!";
  } else if (winner === "player1") {
    playerOneScore++;
    aRoundResultEl.textContent = "Player 1 wins!";
  } else {
    playerTwoScore++;
    aRoundResultEl.textContent = gameMode === "cpu" ? "CPU wins!" : "Player 2 wins!";
  }

  aUpdateScoresUI();
}

// --- HANDLE PLAYER 1 ---
function handleP1Choice(choice) {
  if (gameMode === "cpu") {
    aP1PickEl.textContent = choice;
    aP2PickEl.textContent = "...";
    aRoundResultEl.textContent = "CPU is picking...";
    aGetCpuChoiceFromAPi().then(cpuChoice => aBtnPlayRound(choice, cpuChoice));
  } else {
    aPendingChoice = choice;
    aP1PickEl.textContent = choice;
    aP2PickEl.textContent = "?";
    aRoundResultEl.textContent = "Player 2, pick your move!";
    aP2Hint.textContent = "Your turn!";
  }
}

// --- HANDLE PLAYER 2 (PVP) ---
function handleP2Choice(choice) {
  if (!aPendingChoice) return;
  aBtnPlayRound(aPendingChoice, choice);
  aPendingChoice = "";
  aP2Hint.textContent = "Waiting for Player 1...";
}

// --- EVENT LISTENERS ---
aBtnModeCpu.onclick = () => aSetMode("cpu");
aBtnModePvp.onclick = () => aSetMode("pvp");

Object.keys(buttonsP1).forEach(key => buttonsP1[key].onclick = () => handleP1Choice(key));
Object.keys(buttonsP2).forEach(key => buttonsP2[key].onclick = () => handleP2Choice(key));

aBtnPlayAgain.onclick = () => aClearPicksUI();

aBtnReset.onclick = () => {
  playerOneScore = playerTwoScore = ties = 0;
  aClearPicksUI();
  aUpdateScoresUI();
};

// --- RULES BUTTON ---
const btnRules = document.getElementById("btnRules");
const rulesBox = document.getElementById("rulesBox");
btnRules.onclick = () => {
  rulesBox.classList.toggle("hidden");
  btnRules.textContent = rulesBox.classList.contains("hidden") ? "📜 Show Rules" : "❌ Hide Rules";
};

