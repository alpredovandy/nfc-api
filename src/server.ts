import express from "express";
import cors from "cors";
import PCSC, { Card, KEYS, Reader } from "@tockawa/nfc-pcsc";

const app = express();
const port = process.env.PORT || 3000;

let lastScannedCard: any = null;
// let lastReader: any = null;

const nfc = new PCSC();

const { KEY_TYPE_A } = KEYS;

nfc.on("reader", (reader) => {
  console.log(`${reader.name} device attached`);

  reader.aid = "F222222222";

  // lastReader = reader;

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
    methods: ["GET", "POST", "PUT", "OPTIONS"],
  })
);

app.use(express.json());

async function authenticateAndWrite(
  reader: Reader,
  block: number,
  data: string
) {
  try {
    // Authenticate the block using the type A key and a predefined key value.
    await reader.authenticate(block, KEY_TYPE_A, "FFFFFFFFFFFF");

    // Prepare the data to be written. We're using a 16-byte buffer and filling it with our data.
    const bufferData = Buffer.allocUnsafe(16);
    bufferData.fill(0); // Initialize the buffer with zeros.

    bufferData.write(data); // Write our data string to the buffer.

    // Write the buffer data to the specified block on the card.
    await reader.write(block, bufferData, 16);
  } catch (error) {
    console.log(`Error writing to block ${block}`, error);
    throw error; // Rethrow the error so that it can be caught and handled by an outer scope, if necessary.
  }
}

app.get("/api/v1/scan-card", (req: any, res: any) => {
  if (lastScannedCard) {
    res.send({ status: "success", data: lastScannedCard });
  } else {
    res.send({ status: "error", message: "No card scanned yet." });
  }
});

// app.put("/api/v1/update-card", async (req, res) => {
//   try {
//     const payload = req.body;
//     // Event listener for detecting when a card is in proximity to the reader.
//     lastReader.on("card", async () => {
//       try {
//         // Authenticate and write specific data to several blocks on the card.
//         await authenticateAndWrite(lastReader, 5, "123456789123456");

//         lastReader.close(); // Close the reader after completing the write operations.
//         console.log("Write success"); // Log a message to indicate a successful write operation.
//       } catch (error) {
//         console.log("Write error", error); // Log any error that might occur during the write process.
//       }

//       // Event listener for handling errors that are specific to the reader.
//     });

//     // Global event listener to catch any other NFC-related errors.
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

app.listen(port, () => {
  console.log(`Server is running`);
});
