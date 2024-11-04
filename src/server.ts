import express from "express";
import cors from "cors";
import { NFC } from "nfc-pcsc";

const app = express();
const port = process.env.PORT || 3000;

let lastScannedCard: any = null;
const nfc = new NFC();

nfc.on("reader", (reader: any) => {
  console.log(`${reader.reader.name} device attached`);

  reader.on("card", (card: any) => {
    console.log(`Card detected: `, card);
    lastScannedCard = card;
  });

  reader.on("error", (err: any) => {
    console.error(`Error: ${err}`);
  });

  reader.on("end", () => {
    console.log(`${reader.reader.name}  device removed`);
  });
});

nfc.on("error", (err: any) => {
  console.error(`NFC Error: ${err}`);
});

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "OPTIONS"],
  })
);

app.use(express.json());

app.get("/api/v1/scan-card", (req: any, res: any) => {
  if (lastScannedCard) {
    res.send({ status: "success", data: lastScannedCard });
  } else {
    res.send({ status: "error", message: "No card scanned yet." });
  }
});

app.listen(port, () => {
  console.log(`Server is running`);
});
