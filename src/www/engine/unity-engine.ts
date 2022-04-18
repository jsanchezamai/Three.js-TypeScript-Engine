import { IEngine, IMessage, IWorker, Signals } from "./engine-sdk";

export class UnityEngine extends Worker implements IEngine, IWorker {

    static worker: UnityEngine = new UnityEngine();

    static getWorker() {
        return UnityEngine.worker;
    }

    TAG: string = "UnityEngine";

    constructor() {
        super('./unity-worker.js');
        console.log("Created", this.TAG);
    }

    import(): boolean {
        return true;
    }

    export(): boolean {
        return true;
    }

    ping() {

        addEventListener("message", (event) => {

            console.log("[Core]", this.TAG, "addEventListener", event.data.text);

            const message: IMessage = event.data;
            switch(message.signal) {
                case Signals.SYNC:

                    // Send the primes back to the main thread
                    const message: IMessage = {
                        signal: Signals.ACK,
                        text: "ack"
                    }
                    postMessage(message);
                    break;
                case Signals.ACK:
                    break;
                default:
                    console.log("[Core]", this.TAG, "addEventListener", "404", event.data.text);
            }

        });

        setInterval(() => {

            const message: IMessage = {
                signal: Signals.SYNC,
                text: "sync"
            }

            postMessage(message);

        }, 5000);
    }

}

