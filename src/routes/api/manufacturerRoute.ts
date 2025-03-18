import express from "express";
import {  
    createManufacturer, 
    getManufacturer, 
    deleteManufacturerByID,
    getManufacturerByID,
    updateManufacturer
} from "../../controllers/manufacturerController";

const router = express.Router();

router.post("/create", createManufacturer); // Skapa tillverkare

router.get("/index", getManufacturer); // Hämta alla tillverkare

router.patch("/update/:id", updateManufacturer); // Uppdatera en befintlig tillverkare

router.get("/show/:id", getManufacturerByID); // Hämta specifik tillverkare

router.delete("/delete/:id", deleteManufacturerByID); // Ta bort en tillverkare

export default router;