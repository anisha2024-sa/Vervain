const express = require("express");
const { exec } = require("child_process");
const cors = require("cors");

const app = express();
app.use(cors());

// Check server
app.get("/", (req, res) => {
    res.send("Backend is running");
});

// Scan vulnerabilities
app.get("/scan", (req, res) => {
    exec("npm audit --json", (error, stdout, stderr) => {
        res.send(stdout);
    });
});

// Fix vulnerabilities
app.get("/fix", (req, res) => {
    exec("npm audit fix", (error, stdout, stderr) => {
        if (error) {
      return res.send("Error fixing vulnerabilities");
    }

    res.send("Vulnerabilities fixed successfully!");
  });
});

app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});
