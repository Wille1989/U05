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
const Disc = require("../src/models/discs");
exports.createDisc = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newDisc = yield Disc.create(req.body);
        res.status(201).json(newDisc);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
});
exports.getDisc = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let query = {};
        if (req.query.search) {
            query.$or = [
                { title: { $regex: req.query.search, $options: "i" } },
                { type: { $regex: req.query.search, $options: "i" } },
                { manufacturer: { $regex: req.query.search, $options: "i" } },
                { colours: { $regex: req.query.search, $options: "i" } },
            ];
        }
        if (req.query.type) {
            query.type = req.query.type;
        }
        if (req.query.manufacturer) {
            query.manufacturer = req.query.manufacturer;
        }
        if (req.query.speed) {
            query.speed = req.query.speed;
        }
        if (req.query.glide) {
            query.glide = req.query.glide;
        }
        if (req.query.turn) {
            query.turn = req.query.turn;
        }
        if (req.query.fade) {
            query.fade = req.query.fade;
        }
        const Discs = yield Disc.find(query);
        res.status(200).json(Discs);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.getDiscsById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getDisc = yield Disc.findById(req.params.id);
        if (!book)
            return res.status(404).json({ error: "Discen finns inte i vårat sortiment!" });
        res.status(200).json(getDisc);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.updateDisc = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getDisc = yield Disc.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!getDisc)
            return res.status(404).json({ error: "Discen finns inte i vårat sortiment" });
        res.status(200).json(Disc);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.deleteDisc = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deleteDisc = yield Disc.findByIdAndDelete(req.params.id);
        if (!deleteDisc)
            return res.status(404).json({ error: "Kan inte ta bort en disc som inte finns!" });
        res.status(200).json({ message: "Du har tagit bort discen" });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
