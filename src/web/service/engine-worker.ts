import * as signals from "signals";
import { DUMMY_LIBRARY, EWindow, IEngine, IInteractable, IMessage, IUnityEngine, IWorker, Signals } from "../engine/engine-sdk";

declare let window: EWindow;

export class UnityEngine extends Worker implements IUnityEngine {

    static instance: UnityEngine;
    static library: IInteractable[] = DUMMY_LIBRARY;
    dom: IInteractable[] = [];
    static wbWorker: Worker;

    static get() {

        if (this.instance == null) {
            this.instance = new UnityEngine();
            this.wbWorker = new Worker(new URL('./worker.ts', import.meta.url))
        }

        return this.instance;
    }

    TAG: string = "UnityEngine";

    constructor() {
        super('../service/src_web_service_engine-worker_ts-src_web_service_worker_ts.engine-worker.js');
        console.log("Created", this.TAG);
    }

    init() {
        console.log("[Core]", this.TAG, "init");

        window.editor.signals.loadControlLibrary = new signals.Signal();
        window.editor.signals.loadControlLibrary.add((data: IInteractable[]) => {
            console.log("[Core]", this.TAG, "loadControlLibrary", data);
            this.dom = data;
        })

        UnityEngine.wbWorker.addEventListener("message", (event) => {

            console.log("[Core]", this.TAG, "addEventListener", event.data);
            switch(event.data.signal) {
                case Signals.IMPORTED_CONTROL_LIBRARY:
                    const dom = JSON.parse(event.data.params);
                    window.editor.signals.loadControlLibrary.dispatch(dom);
                    break;
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

        });

        const message: IMessage = {
            signal: Signals.IMPORT_CONTROL_LIBRARY,
            text: "IMPORT_CONTROL_LIBRARY"
        }
        UnityEngine.wbWorker.postMessage(message);
    }

    import(): boolean {
        throw new Error("Method not implemented.");
    }

    export(): boolean {
        return true;
    }

    ping() {

        setInterval(() => {
            const message: IMessage = {
                signal: Signals.SYNC,
                text: "SYNC"
            }

            UnityEngine.wbWorker.postMessage(message);

        }, 50000);
    }

}

