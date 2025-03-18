"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const manufacturerController_1 = require("../../controllers/manufacturerController");
const router = express_1.default.Router();
router.post("/create", manufacturerController_1.createManufacturer); // Skapa tillverkare
router.get("/index", manufacturerController_1.getManufacturer); // Hämta alla tillverkare
router.patch("/update/:id", manufacturerController_1.updateManufacturer); // Uppdatera en befintlig tillverkare
router.get("/show/:id", manufacturerController_1.getManufacturerByID); // Hämta specifik tillverkare
router.delete("/delete/:id", manufacturerController_1.deleteManufacturerByID); // Ta bort en tillverkare
exports.default = router;
