import express, { Request, Response } from "express";
import cors from "cors";
import path from "path";
import PCSC, { Card } from "@tockawa/nfc-pcsc";

const app = express();
const port = process.env.PORT || 3000;

let lastScannedCard: any = null;

const nfc = new PCSC();

nfc.on("reader", (reader) => {
  console.log(`${reader.name} device attached`);

  reader.aid = "F222222222";

  reader.on("card", (card: Card) => {
    console.log(`${reader.name} card detected`, card);
    lastScannedCard = card;
  });

  reader.on("card.off", (card: Card) => {
    console.log(`${reader.name} card removed`, card);
  });

  reader.on("error", (err) => {
    console.log(`${reader.name} an error occurred`, err);
  });

  reader.on("end", () => {
    console.log(`${reader.name} device removed`);
  });
});

nfc.on("error", (err) => {
  console.log("an error occurred", err);
});

app.use(
  cors({
    origin: "*",
    methods: "GET, HEAD, PUT, PATCH, POST, DELETE",
  })
);

app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "../public")));

// Define the main route to serve HTML
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "index.html"));
});

app.use((req, res) => {
  res.status(404).send("Route not found");
});

app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).send("Something broke!");
  }
);

app.get("/api/v1/scan-card", (req: Request, res: Response) => {
  console.log("Route /api/v1/scan-card called");
  console.log("Last scanned card:", lastScannedCard);
  if (lastScannedCard) {
    res.send({ status: "success", data: lastScannedCard });
  } else {
    res.send({ status: "error", message: "No card scanned yet." });
  }
});

app.listen(port, () => {
  console.log(`Server is running...`);
});
