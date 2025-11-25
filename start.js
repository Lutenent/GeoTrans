// start.js — общий автозапуск backend + frontend

const { spawn } = require("child_process");

// Запуск backend
const backend = spawn("npm", ["run", "server"], {
  cwd: "./backend",
  stdio: "inherit",
  shell: true,
});

// Запуск frontend
const frontend = spawn("npm", ["run", "dev"], {
  cwd: "./",
  stdio: "inherit",
  shell: true,
});

backend.on("close", (code) => {
  console.log(`Backend остановился. Код: ${code}`);
});

frontend.on("close", (code) => {
  console.log(`Frontend остановился. Код: ${code}`);
});
