const socket = io();

const screenNick = document.getElementById("screen-nick");
const screenLobby = document.getElementById("screen-lobby");
const screenGame = document.getElementById("screen-game");

const nickForm = document.getElementById("nick-form");
const nickInput = document.getElementById("nick-input");
const playersList = document.getElementById("players-list");
const startBtn = document.getElementById("start-btn");
const lobbyHint = document.getElementById("lobby-hint");

const wordDisplay = document.getElementById("word-display");
const nextWordBtn = document.getElementById("next-word-btn");
const fullscreenBtn = document.getElementById("fullscreen-btn");
const endGameBtn = document.getElementById("end-game-btn");

function showScreen(screen) {
  [screenNick, screenLobby, screenGame].forEach((s) => s.classList.remove("active"));
  screen.classList.add("active");
}

// Zapamiętaj nick w tej karcie przeglądarki, żeby przetrwał odświeżenie
nickForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const nickname = nickInput.value.trim();
  if (!nickname) return;
  sessionStorage.setItem("czolko_nick", nickname);
  socket.emit("join", nickname);
});

socket.on("connect", () => {
  const savedNick = sessionStorage.getItem("czolko_nick");
  if (savedNick) {
    socket.emit("join", savedNick);
  }
});

socket.on("joined", ({ gameStarted }) => {
  showScreen(gameStarted ? screenGame : screenLobby);
});

socket.on("players_update", (players) => {
  playersList.innerHTML = "";
  players.forEach((p) => {
    const li = document.createElement("li");
    li.textContent = p;
    playersList.appendChild(li);
  });

  const enough = players.length >= 2;
  startBtn.disabled = !enough;
  lobbyHint.textContent = enough
    ? `Gotowi! Kliknij Start, żeby zacząć (${players.length} graczy).`
    : `Potrzeba minimum 2 graczy, żeby rozpocząć (obecnie: ${players.length}).`;
});

startBtn.addEventListener("click", () => {
  socket.emit("start_game");
});

socket.on("game_started", () => {
  showScreen(screenGame);
});

socket.on("your_word", (word) => {
  wordDisplay.textContent = word;
});

nextWordBtn.addEventListener("click", () => {
  socket.emit("new_word");
});

fullscreenBtn.addEventListener("click", () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => {});
  } else {
    document.exitFullscreen();
  }
});

endGameBtn.addEventListener("click", () => {
  if (confirm("Czy na pewno chcesz zakończyć grę dla wszystkich graczy?")) {
    socket.emit("end_game");
  }
});

socket.on("game_ended", () => {
  showScreen(screenLobby);
});
