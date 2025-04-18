import fs from "node:fs/promises";

import express from "express";
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();

const PORT = 3000;

app.use(express.json());

// CORS-middleware
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // Allow all domains
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// Nodig om __dirname te gebruiken in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Functie om een bestand te lezen (asynchroon)
const readFile = async (filePath) => {
  try {
    const fileContent = await fs.readFile(filePath, "utf-8");
    return JSON.parse(fileContent);
  } catch (err) {
    console.error(`Error reading file ${filePath}:`, err);
    throw new Error("Could not read data file.");
  }
};

// Functie om een bestand te schrijven (asynchroon)
const writeFile = async (filePath, data) => {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(`Error writing file ${filePath}:`, err);
    throw new Error("Could not write to data file.");
  }
};

// API route om teams op te halen
app.get("/api/teams", async (req, res) => {
  try {
    const teamsData = await readFile(path.join(__dirname, 'data', 'teams.json'));
    res.status(200).json({ teams: teamsData });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// API route om een team toe te voegen (voorbeeld voor POST)
app.post("/api/teams", express.json(), async (req, res) => {
  try {
    const newTeam = req.body; // Het team dat wordt toegevoegd via de request body
    const teamsData = await readFile(path.join(__dirname, 'data', 'teams.json'));
    teamsData.push(newTeam); // Voeg het nieuwe team toe aan de lijst

    // Schrijf de nieuwe data terug naar het bestand
    await writeFile(path.join(__dirname, 'data', 'teams.json'), teamsData);
    res.status(201).json({ message: "Team added successfully", team: newTeam });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// API route om drivers op te halen
app.get("/api/drivers", async (req, res) => {
  try {
    const driversData = await readFile(path.join(__dirname, 'data', 'drivers.json'));
    res.status(200).json({ drivers: driversData });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// API route om een team toe te voegen (voorbeeld voor POST)
app.post("/api/drivers", express.json(), async (req, res) => {
  try {
    const newDriver = req.body; // Het team dat wordt toegevoegd via de request body
    const driversData = await readFile(path.join(__dirname, 'data', 'drivers.json'));
    driversData.push(newDriver); // Voeg het nieuwe team toe aan de lijst

    // Schrijf de nieuwe data terug naar het bestand
    await writeFile(path.join(__dirname, 'data', 'teams.json'), teamsData);
    res.status(201).json({ message: "Team added successfully", team: newTeam });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Foutafhandelingsmiddleware voor niet-gevonden routes
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  res.status(404).json({ message: "404 - Not Found" });
});

// Als de gebruiker een onbekende route bezoekt
app.use((req, res) => {
  res.status(404).json({ message: "404 - Not Found" });
});

// Server starten
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});