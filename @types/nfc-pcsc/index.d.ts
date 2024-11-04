declare module "nfc-pcsc" {
  export interface Card {
    uid: string;
    // Additional card properties can go here
  }

  export interface Reader {
    reader: {
      name: string;
    };
    on(event: "card", listener: (card: Card) => void): this;
    on(event: "error", listener: (error: any) => void): this;
    on(event: "end", listener: () => void): this;
  }

  export class NFC {
    constructor();
    on(event: "reader", listener: (reader: Reader) => void): this;
    on(event: "error", listener: (error: any) => void): this;
  }
}
