import { IMessage, Signals } from "../engine/engine-sdk";

self.onmessage = (event) => {
  console.log("[Core] Worker", "onmessage full", event.data);
    console.log("[Core] Worker", "onmessage", event.data.text);

    const message: IMessage = event.data;
    switch(message.signal) {
        case Signals.SYNC:

            // Send the primes back to the main thread
            const message: IMessage = {
                signal: Signals.ACK,
                text: "ack"
            }
            self.postMessage(message);
            break;
        case Signals.ACK:
            break;
        default:
            console.log("[Core]", "onmessage", "404", event.data.text);
    }
};