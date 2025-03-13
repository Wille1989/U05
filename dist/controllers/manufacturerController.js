"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteManufacturer = exports.updateManufacturer = exports.getManufacturerByID = exports.getManufacturer = exports.createManufacturer = void 0;
const manufacturer_1 = __importDefault(require("../models/manufacturer"));
const disc_1 = __importDefault(require("../models/disc"));
const createManufacturer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, country } = req.body;
        if (!name || !country) {
            res.status(404).json({ error: "båda fälten för tillverkare måste vara ifyllda!" });
            return;
        }
        const newManufacturer = yield manufacturer_1.default.create({
            name,
            country,
        });
        res.status(201).json(newManufacturer);
    }
    catch (err) {
        console.error(`Fel uppstod vid skapandet av tillverkare`, err);
        res.status(500).json({ error: "Ett internt serverfel uppstod när anrop gjordes" });
    }
});
exports.createManufacturer = createManufacturer;
const getManufacturer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const manufacturers = yield manufacturer_1.default.find();
        if (!manufacturers) {
            res.status(404).json(["Gick inte att hämta tillverkare!"]);
        }
        res.status(200).json(manufacturers);
    }
    catch (err) {
        console.error(`Gick inte att hämta tillverkare`, err);
        res.status(500).json({ error: "Ett internt serverfel uppstod när anrop gjordes" });
    }
});
exports.getManufacturer = getManufacturer;
const getManufacturerByID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getManufacturerByID = yield manufacturer_1.default.findById(req.params.id);
        if (!getManufacturerByID) {
            res.status(404).json([`Tillverkaren kunde inte hittas!`]);
            return;
        }
        res.status(200).json(getManufacturerByID);
    }
    catch (err) {
        console.error(`Något fick fel vid hämtning av den specifika tillverkaren!
            - ID ${req.params.id}`, "- Felmeddelande:", err);
        res.status(500).json({ error: "Ett internt serverfel uppstod när anrop gjordes" });
    }
});
exports.getManufacturerByID = getManufacturerByID;
const updateManufacturer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const manufacturerDocs = yield manufacturer_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!manufacturerDocs) {
            res.status(404).json(["Tillverkaren kunde inte hittas och gick ej att uppdatera!"]);
            return;
        }
        res.status(200).json(manufacturerDocs);
    }
    catch (err) {
        console.error(`Fel vid uppdatering av tillverkare!
            - ID: ${req.params.id}
            - request body:`, req.body, "- Felmeddelande:", err);
        res.status(500).json({ error: "Ett internt serverfel uppstod när anrop gjordes" });
    }
});
exports.updateManufacturer = updateManufacturer;
const deleteManufacturer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deleteManufacturer = yield manufacturer_1.default.findById(req.params.id);
        if (!deleteManufacturer) {
            res.status(400).json({ error: "Kan inte hitta en tillverkare med detta ID" });
            return;
        }
        yield disc_1.default.deleteMany({ manufacturer: deleteManufacturer._id });
        yield manufacturer_1.default.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Du har tagit bort tillverkaren och alla tillhörande discar!" });
    }
    catch (err) {
        console.error(`Fel uppstod vid borttagning av tillverkare!
            - ID: ${req.params.id}`, "- Felmeddelande:", err);
        res.status(500).json({ error: err.message });
    }
});
exports.deleteManufacturer = deleteManufacturer;
