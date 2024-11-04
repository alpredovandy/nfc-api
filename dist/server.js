"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const nfc_pcsc_1 = require("nfc-pcsc");
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
let lastScannedCard = null;
const nfc = new nfc_pcsc_1.NFC();
nfc.on("reader", (reader) => {
    console.log(`${reader.reader.name} device attached`);
    reader.on("card", (card) => {
        console.log(`Card detected: `, card);
        lastScannedCard = card;
    });
    reader.on("error", (err) => {
        console.error(`Error: ${err}`);
    });
    reader.on("end", () => {
        console.log(`${reader.reader.name}  device removed`);
    });
});
nfc.on("error", (err) => {
    console.error(`NFC Error: ${err}`);
});
app.use((0, cors_1.default)({
    origin: "*",
    methods: ["GET", "POST", "OPTIONS"],
}));
app.use(express_1.default.json());
app.get("/api/v1/scan-card", (req, res) => {
    if (lastScannedCard) {
        res.send({ status: "success", card: lastScannedCard });
    }
    else {
        res.send({ status: "error", message: "No card scanned yet." });
    }
});
app.listen(port, () => {
    console.log(`Server is running`);
});
