"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const discController_1 = require("../../controllers/discController");
const router = express_1.default.Router();
router.post("/create", discController_1.createDisc); // Skapa en disc
router.get("/index", discController_1.getDisc); // Hämta alla discar
router.get("/show/:id", discController_1.getDiscsById); // Hämta specifik disc
router.patch("/update/:id", discController_1.updateDisc); // Uppdatera befintlig disc
router.delete("/delete/:id", discController_1.deleteDisc); // Ta bort en disc
exports.default = router;
