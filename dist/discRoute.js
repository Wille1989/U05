"use strict";
const express = require("express");
const { createDisc, getDisc, getDiscsById, updateDisc, deleteDisc } = require("../src/controllers/discController");
const router = express.Router();
router.post("/", createDisc); // Skapa
router.get("/", getDisc); // Hämta alla discar
router.get("/:id", getDiscsById); // Hämta specifik disc
router.put("/:id", updateDisc); // Uppdatera befintlig disc
router.delete("/:id", deleteDisc); // Ta bort en disc
