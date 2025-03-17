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
exports.deleteDisc = exports.updateDisc = exports.getDiscsById = exports.getDisc = exports.createDisc = void 0;
const disc_1 = __importDefault(require("../models/disc"));
const manufacturer_1 = __importDefault(require("../models/manufacturer"));
const mongoose_1 = __importDefault(require("mongoose"));
const createDisc = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newDisc = new disc_1.default(req.body);
        yield newDisc.save();
        res.status(201).json(newDisc);
    }
    catch (err) {
        console.error("Fel vid skapande av disc", {
            error: err,
            requestbody: req.body
        });
        if (err instanceof mongoose_1.default.Error.ValidationError) {
            res.status(400).json({ error: err.message });
        }
        else {
            res.status(500).json({ error: "Ett internt serverfel uppstod vid anrop" });
        }
    }
});
exports.createDisc = createDisc;
const getDisc = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        let query = {};
        const searchTerm = (_a = req.query.search) === null || _a === void 0 ? void 0 : _a.trim();
        if (searchTerm) {
            query.$or = [
                { title: { $regex: searchTerm, $options: "i" } },
                { type: { $regex: searchTerm, $options: "i" } }
            ];
        }
        if (searchTerm && !req.query.manufacturer) {
            const manufacturerDocs = yield manufacturer_1.default.find({
                name: { $regex: searchTerm, $options: "i" },
                country: { $regex: searchTerm, $options: "i" }
            });
            if (!manufacturerDocs) {
                throw new Error("Database error: Manufacturer query returned null");
            }
            if (!query.$or) {
                query.$or = [];
            }
            if (manufacturerDocs.length > 0) {
                query.$or.push({ manufacturer: { $in: manufacturerDocs.map(m => m._id) } });
            }
            else {
                throw new Error("Internal server Error: $or should be an array but isn't");
            }
        }
        if (req.query.type)
            query.type = req.query.type;
        if (req.query.manufacturer)
            query.manufacturer = req.query.manufacturer;
        const numericField = ["speed", "glide", "turn", "fade"];
        numericField.forEach((field) => {
            if (req.query[field]) {
                const value = req.query[field];
                if (typeof value === "string") {
                    query[field] = Number(value);
                }
                else if (typeof value === "object" && value !== null) {
                    query[field] = {};
                    for (const operator in value) {
                        if (["gte", "lte", "gt", "lt"].includes(operator)) {
                            query[field][`$${operator}`] = Number(value[operator]);
                        }
                    }
                }
            }
        });
        let Discs = yield disc_1.default.find(query).populate("manufacturer");
        if (Discs.length === 0) {
            let fallbackquery = {};
            numericField.forEach((field) => {
                if (req.query[field]) {
                    const requestedValue = Number(req.query[field]);
                    fallbackquery[field] = { $in: [
                            requestedValue - 1,
                            requestedValue - 2,
                            requestedValue - 3,
                            requestedValue + 1,
                            requestedValue + 2,
                            requestedValue + 3,
                        ] };
                }
            });
            Discs = yield disc_1.default.find(fallbackquery).populate("manufacturer");
        }
        res.status(200).json(Discs);
    }
    catch (err) {
        console.error(`fel för objektID: ${req.params.id}`);
        res.status(500).json({ error: "Ett internt serverfel uppstod när anrop gjordes" });
    }
});
exports.getDisc = getDisc;
const getDiscsById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getDisc = yield disc_1.default.findById(req.params.id).populate("manufacturer");
        if (!getDisc) {
            res.status(404).json({ error: "Discen finns inte i vårat sortiment!" });
            return;
        }
        res.status(200).json(getDisc);
    }
    catch (err) {
        console.error("fel vid hämtning av discs:", err);
        res.status(500).json({ error: "Ett internt serverfel uppstod när anrop gjordes" });
    }
});
exports.getDiscsById = getDiscsById;
const updateDisc = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getDisc = yield disc_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!getDisc) {
            res.status(404).json({ error: `Disc med ID: ${req.params.id} går inte att hitta` });
            return;
        }
        res.status(200).json(getDisc);
    }
    catch (err) {
        console.error(`Ett fel uppstod när: ${req.params.id} skulle uppdateras och körningen avbröts!`, err);
        res.status(500).json({ error: "Ett internt serverfel uppstod när anrop gjordes" });
    }
});
exports.updateDisc = updateDisc;
const deleteDisc = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deleteDisc = yield disc_1.default.findByIdAndDelete(id);
        if (!deleteDisc) {
            return res.status(404).json({ error: `ID:t ${id} kan ej hittas!` });
        }
        return res.status(200).json({ message: "Du har tagit bort discen" });
    }
    catch (err) {
        console.error(`Fel uppstod vid uppdatering av specifik tillverkare`, {
            id: req.params.id || "Ej tillgängligt",
            error: err
        });
        return res.status(500).json({ error: "Ett internt serverfel uppstod när anrop gjordes" });
    }
});
exports.deleteDisc = deleteDisc;
