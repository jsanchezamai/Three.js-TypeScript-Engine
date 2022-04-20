import { IInteractable, IMessage, IUnityEngine, Signals } from "../engine/engine-sdk";
import { UnityEngine } from "./engine-worker";

export class Handler implements IUnityEngine {

    TAG: string = "WorkerHandler";

    dom: IInteractable[] = [];

    ping(): void {
        throw new Error("Method not implemented.");
    }

    export(): boolean {
        throw new Error("Method not implemented.");
    }

    import(): boolean {
        console.log("[Core]", this.TAG, "import");

        // dummy
        this.dom = UnityEngine.library;

        return true;
    }

}

const handler = new Handler();

self.onmessage = (event) => {

    console.log("[Core] Worker", "onmessage", event.data);

    const message: IMessage = event.data;
    switch(message.signal) {
        case Signals.IMPORT_CONTROL_LIBRARY:
            if (handler.import()) {
                const message: IMessage = {
                    signal: Signals.IMPORTED_CONTROL_LIBRARY,
                    params: JSON.stringify(handler.dom)
                }
                self.postMessage(message);
            }
            break;
        case Signals.SYNC:

            // Send the primes back to the main thread
            const message: IMessage = {
                signal: Signals.ACK,
                text: "ACK"
            }
            self.postMessage(message);
            break;
        case Signals.ACK:
            break;
        default:
            console.log("[Core]", "onmessage", "404", event.data);
    }
};