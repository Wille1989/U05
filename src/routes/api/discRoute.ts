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

router.put("/update/:id",updateDisc); // Uppdatera befintlig disc

router.delete("/delete/:id",deleteDisc); // Ta bort en disc


router.delete("/delete/:id", (req: Request, res: Response) => {
    console.log("DELETE request received, ID:", req.params.id);
    res.status(200).json({ message: "Delete successful!" });
});

export default router;