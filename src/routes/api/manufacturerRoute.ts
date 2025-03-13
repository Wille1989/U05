import express from "express";
import { Router } from "express";
import {  
    createManufacturer, 
    getManufacturer, 
    deleteManufacturer,
    getManufacturerByID,
    updateManufacturer
} from "../../controllers/manufacturerController";

const router: Router = express.Router();

router.post("/create", createManufacturer); // Skapa tillverkare

router.get("/index", getManufacturer); // Hämta alla tillverkare

router.put("/update/:id", updateManufacturer); // Uppdatera en befintlig tillverkare

router.post("/show/:id", getManufacturerByID); // Hämta specifik tillverkare

router.delete("/delete/:id", deleteManufacturer); // Ta bort en tillverkare

export default router;