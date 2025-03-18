import express from "express";
import { Request, Response } from "express";

import { 
    createDisc, 
    getDisc, 
    getDiscsById, 
    updateDisc, 
    deleteDisc 
    } from "../../controllers/discController";

const router = express.Router();

router.post("/create", createDisc); // Skapa en disc

router.get("/index", getDisc); // Hämta alla discar

router.get("/show/:id",getDiscsById); // Hämta specifik disc

router.patch("/update/:id",updateDisc); // Uppdatera befintlig disc

router.delete("/delete/:id",deleteDisc); // Ta bort en disc

export default router;