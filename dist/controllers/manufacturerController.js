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
// MAIN
const mongoose_1 = __importDefault(require("mongoose"));
// MODELS
const manufacturer_1 = __importDefault(require("../models/manufacturer"));
const disc_1 = __importDefault(require("../models/disc"));
// SKAPA TILLVERKARE
const createManufacturer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { name, country } = req.body;
        if (!name || !country) {
            return res.status(404).json({ error: "Namn och Land är obligatoriska fält!" });
        }
        name = name.trim().toLowerCase();
        const existingManufacturer = yield manufacturer_1.default.findOne({ name });
        if (existingManufacturer) {
            return res.status(409).json({ error: "Tillverkaren finns redan, hämta alla tillverkare istället!" });
        }
        const newManufacturer = yield manufacturer_1.default.create({
            name,
            country,
        });
        return res.status(201).json(newManufacturer);
    }
    catch (err) {
        console.error(`Fel uppstod vid skapandet av tillverkare`, {
            requestbody: req.body,
            error: err
        });
        return res.status(500).json({ error: "Ett internt serverfel uppstod vid anrop" });
    }
});
exports.createManufacturer = createManufacturer;
// HÄMTA ALLA TILLVERKARE
const getManufacturer = (res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const manufacturers = yield manufacturer_1.default.find();
        if (manufacturers.length === 0) {
            return res.status(404).json({ error: "inga tillverkare hittades!" });
        }
        return res.status(200).json(manufacturers);
    }
    catch (err) {
        console.error(`Gick inte att hämta tillverkare`, {
            error: err
        });
        return res.status(500).json({ error: "Ett internt serverfel uppstod när anrop gjordes" });
    }
});
exports.getManufacturer = getManufacturer;
// HÄMTA SPECIFIK TILLVERKARE
const getManufacturerByID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const getManufacturerByID = yield manufacturer_1.default.findById(id);
        if (!getManufacturerByID) {
            return res.status(404).json({ error: "Tillverkaren kunde inte hittas!" });
        }
        return res.status(200).json(getManufacturerByID);
    }
    catch (err) {
        console.error(`Fel uppstod vid hämtning av specifik tillverkare`, {
            id: req.params.id || "Ej tillgängligt",
            error: err
        });
        if (err instanceof mongoose_1.default.Error.CastError) {
            return res.status(400).json({ error: "Ogiltigt ID-format!" });
        }
        return res.status(500).json({ error: "Ett internt serverfel uppstod vid anrop" });
    }
});
exports.getManufacturerByID = getManufacturerByID;
// HÄMTA OCH UPPDATERA BEFINTLIG TILLVERKARE
const updateManufacturer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updateData = req.body;
        if (!updateData.name && !updateData.country) {
            return res.status(400).json({ error: "Fälten kan inte vara tomma!" });
        }
        const manufacturerDocs = yield manufacturer_1.default.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
        if (!manufacturerDocs) {
            return res.status(404).json({ error: "tillverkare hittades ej och kunde inte uppdateras!" });
        }
        return res.status(200).json(manufacturerDocs);
    }
    catch (err) {
        console.error(`Fel uppstod vid uppdatering av specifik tillverkare`, {
            id: req.params.id || "Ej tillgängligt",
            requestbody: req.body,
            error: err
        });
        if (err instanceof mongoose_1.default.Error.CastError) {
            return res.status(400).json({ error: "Ogiltigt ID-format!" });
        }
        return res.status(500).json({ error: "Ett internt serverfel uppstod när anrop gjordes" });
    }
});
exports.updateManufacturer = updateManufacturer;
// TA BORT TILLVERKARE
const deleteManufacturer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: "Ett ID måste anges!" });
        }
        const deleteManufacturer = yield manufacturer_1.default.findById(id);
        if (!deleteManufacturer) {
            return res.status(400).json({ error: "Kan inte hitta en tillverkare med detta ID" });
        }
        yield disc_1.default.deleteMany({ manufacturer: deleteManufacturer._id });
        yield manufacturer_1.default.findByIdAndDelete(id);
        return res.status(200).json({ message: "Du har tagit bort tillverkaren och alla tillhörande discar!" });
    }
    catch (err) {
        console.error(`Fel uppstod när tillverkaren skulle tas bort`, {
            id: req.params.id || "Ej tillgängligt",
            error: err
        });
        return res.status(500).json({ error: "Ett internt serverfel uppstod när anrop gjordes" });
    }
});
exports.deleteManufacturer = deleteManufacturer;
