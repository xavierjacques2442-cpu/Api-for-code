let gameMode = 'cpu';
let aPendingChoice = "";
let playerOneScore = 0;
let playerTwoScore = 0;
let ties = 0;

// --- API CONFIG ---
const aCpuApiUrl = "https://hrpsxj26-d6d3brbmg6ezcjgz.westus3-01.azurewebsites.net";

// --- DOM ELEMENTS ---
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

const btnRules = document.getElementById("btnRules");
const rulesBox = document.getElementById("rulesBox");

// Player buttons
const buttons = {
  p1: {
    rock: document.getElementById("btnP1Rock"),
    paper: document.getElementById("btnP1Paper"),
    scissors: document.getElementById("btnP1Scissors"),
    lizard: document.getElementById("btnP1Lizard"),
    spock: document.getElementById("btnP1Spock"),
  },
  p2: {
    rock: document.getElementById("btnP2Rock"),
    paper: document.getElementById("btnP2Paper"),
    scissors: document.getElementById("btnP2Scissors"),
    lizard: document.getElementById("btnP2Lizard"),
    spock: document.getElementById("btnP2Spock"),
  }
};

// --- RULES ---
const RULES = {
  rock: ["scissors", "lizard"],
  paper: ["rock", "spock"],
  scissors: ["paper", "lizard"],
  lizard: ["paper", "spock"],
  spock: ["scissors", "rock"]
};

// --- MODE ---
function aSetMode(mode) {
  gameMode = mode;
  aPendingChoice = "";
  aClearPicksUI();

  if (mode === "cpu") {
    aP2Section.style.display = "none";
    aModeHint.textContent = "You are playing against the CPU.";
  } else {
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

// --- CPU ---
function aGetCpuChoiceFromAPi() {
  return fetch(aCpuApiUrl)
    .then(r => r.text())
    .then(t => t.trim().toLowerCase());
}

// --- GAME LOGIC ---
function aDetermineWinner(p1, p2) {
  if (p1 === p2) return "tie";
  if (RULES[p1].includes(p2)) return "player1";
  return "player2";
}

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

// --- HANDLERS ---
function handleP1Choice(choice) {
  if (gameMode === "cpu") {
    aGetCpuChoiceFromAPi().then(cpu => aBtnPlayRound(choice, cpu));
  } else {
    aPendingChoice = choice;
    aP1PickEl.textContent = choice;
    aP2PickEl.textContent = "?";
    aRoundResultEl.textContent = "Player 2, pick!";
    aP2Hint.textContent = "Your turn!";
  }
}

function handleP2Choice(choice) {
  if (!aPendingChoice) return;
  aBtnPlayRound(aPendingChoice, choice);
  aPendingChoice = "";
  aP2Hint.textContent = "Waiting for Player 1...";
}

// --- EVENTS ---
aBtnModeCpu.onclick = () => aSetMode("cpu");
aBtnModePvp.onclick = () => aSetMode("pvp");

Object.keys(buttons.p1).forEach(key =>
  buttons.p1[key].onclick = () => handleP1Choice(key)
);
Object.keys(buttons.p2).forEach(key =>
  buttons.p2[key].onclick = () => handleP2Choice(key)
);

aBtnPlayAgain.onclick = aClearPicksUI;

aBtnReset.onclick = () => {
  playerOneScore = playerTwoScore = ties = 0;
  aClearPicksUI();
  aUpdateScoresUI();
};

btnRules.onclick = () => {
  rulesBox.classList.toggle("hidden");
  btnRules.textContent = rulesBox.classList.contains("hidden")
    ? "📜 Show Rules"
    : "❌ Hide Rules";
};

