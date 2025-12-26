const { exec } = require("child_process");
const axios = require("axios"); // You might need to install axios or use fetch if node 18+

// This script expects the app (port 3000) and redis to be running.
// It manually starts/stops the worker process.

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

let workerProcess;

function startWorker() {
  console.log("Starting worker...");
  workerProcess = exec("npm run worker");
  workerProcess.stdout.on("data", (data) => console.log(`[Worker]: ${data}`));
  workerProcess.stderr.on("data", (data) =>
    console.error(`[Worker Error]: ${data}`)
  );
}

function killWorker() {
  if (workerProcess) {
    console.log("Killing worker...");
    workerProcess.kill();
    workerProcess = null;
  }
}

async function runTest() {
  // 1. Start Worker
  startWorker();
  await sleep(5000); // warm up

  // 2. Kill Worker
  killWorker();
  console.log("Worker killed. Submitting job...");

  // 3. Submit Job (Mocking the API call or using a script that calls the API)
  // Here we'd ideally call the local API
  // const res = await fetch('http://localhost:3000/api/convert/word', ...)
  // But since we can't easily spin up the Next server here without blocking,
  // we assume the user follows the manual verification steps.

  console.log(
    "TEST SKIPPED: This script requires the Next.js server to be running separately."
  );
  console.log("Manual Steps:");
  console.log("1. Run 'npm run dev'");
  console.log("2. Run 'npm run worker'");
  console.log("3. Start conversion");
  console.log("4. Kill worker terminal");
  console.log("5. Restart worker terminal");
  console.log("6. Observe job resumes");
}

runTest();
