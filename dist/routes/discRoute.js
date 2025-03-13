"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const discController_1 = require("../controllers/discController");
const router = express_1.default.Router();
router.post("/", discController_1.createDisc); // Skapa
router.get("/", discController_1.getDiscs); // Hämta alla discar
router.get("/:id", discController_1.getDiscsById); // Hämta specifik disc
router.put("/:id", discController_1.updateDisc); // Uppdatera befintlig disc
router.delete("/:id", discController_1.deleteDisc); // Ta bort en disc
exports.default = router;
