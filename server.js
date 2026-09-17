const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");
const words = require("./words");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, "public")));

// --- Stan gry (prosta, jednopokojowa gra na cały serwer) ---
let players = {}; // socket.id -> nickname
let gameStarted = false;
let wordQueue = [];

function refillQueue() {
  wordQueue = [...words];
  // Tasowanie (Fisher-Yates), żeby hasła nie powtarzały się zbyt szybko
  for (let i = wordQueue.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [wordQueue[i], wordQueue[j]] = [wordQueue[j], wordQueue[i]];
  }
}

function getRandomWord() {
  if (wordQueue.length === 0) refillQueue();
  return wordQueue.pop();
}

function broadcastPlayers() {
  io.emit("players_update", Object.values(players));
}

io.on("connection", (socket) => {
  socket.on("join", (nickname) => {
    nickname = String(nickname || "").trim().slice(0, 20);
    if (!nickname) return;
    players[socket.id] = nickname;
    broadcastPlayers();
    socket.emit("joined", { gameStarted });
  });

  socket.on("start_game", () => {
    if (Object.keys(players).length < 2) return;
    gameStarted = true;
    refillQueue();
    for (const id of Object.keys(players)) {
      const word = getRandomWord();
      io.to(id).emit("your_word", word);
    }
    io.emit("game_started");
  });

  socket.on("new_word", () => {
    if (!gameStarted) return;
    const word = getRandomWord();
    socket.emit("your_word", word);
  });

  socket.on("end_game", () => {
    gameStarted = false;
    io.emit("game_ended");
  });

  socket.on("disconnect", () => {
    delete players[socket.id];
    broadcastPlayers();
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Serwer gry Czółko działa na porcie ${PORT}`);
});
