import { IInteractable, IMessage, IUnityEngine, Signals } from "../engine/engine-sdk";
import { IEvent, UnityEngine } from "./engine-worker";

export interface IListener {
    message: string, 
    callback: (event: IEvent) => void
}
export class Handler implements IUnityEngine {
    listeners: IListener[] = [];

    onmessage(event: IEvent) {
        console.log("[Core] Worker", "onmessage", event.data);

        const message: IMessage = event.data;
        switch(message.signal) {
            case Signals.IMPORT_CONTROL_LIBRARY:
                if (handler.import()) {
                    const message: IMessage = {
                        signal: Signals.IMPORTED_CONTROL_LIBRARY,
                        params: JSON.stringify(handler.dom)
                    }
                    this.listeners.forEach(l => l.callback({ data: message }));
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
    }

    TAG: string = "WorkerHandler";

    constructor() {
        console.log('New handler created');
    }

    import(path_to_gltf_asset?: string): boolean;
    import(path_to_gltf_asset?: string): Promise<boolean>;
    import(path_to_gltf_asset?: any): boolean | Promise<boolean> {
        console.log("[Core]", this.TAG, "import", UnityEngine.library);

        // dummy
        this.dom = Object.assign({},  UnityEngine.library);

        return true;
    }

    dom: IInteractable[] = [];

    ping(timems: number): void {
        console.log('call ping worker')
        throw new Error("Method not implemented.");
    }

    export(dom: IInteractable[]): boolean {
        console.log("[Core]", this.TAG, "export", UnityEngine.library);
        return true;
    }

}

const handler = new Handler();

self.onmessage = (event) => {

    console.log("[Core] Worker", "onmessage", "Event.Data:", event.data);

    const evMessage: IMessage = event.data;
    switch(evMessage.signal) {
        case Signals.IMPORT_CONTROL_LIBRARY:
            if (handler.import()) {
                const message: IMessage = {
                    signal: Signals.IMPORTED_CONTROL_LIBRARY,
                    params: JSON.stringify(handler.dom)
                }
                self.postMessage(message);
            }
            break;
        case Signals.EXPORT_CONTROL_LIBRARY:
            if (handler.export(evMessage.params)) {
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
            console.log("[Core] Worker", "onmessage", "NOT IMPLEMENTED event.data.signal",
            Signals[evMessage.signal], event);
    }
};