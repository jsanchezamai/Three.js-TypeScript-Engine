import * as signals from "signals";
import { DUMMY_LIBRARY, EWindow, IInteractable, IMessage, IUnityEngine, Signals } from "../engine/engine-sdk";
import { Handler } from "./worker";

declare let window: EWindow;

export interface IEvent { data: IMessage }

export class Worker {
    worker: Handler;
    constructor(url: String | URL) {
        this.worker = new Handler();
    }
    addEventListener(message: string, callback: (event: IEvent) => void) {
        
    }
    postMessage(message: IMessage) {
        this.worker.onmessage({ data: message });
    }
}
const wspath = '';

export class UnityEngine extends Worker implements IUnityEngine {

    static instance: UnityEngine;
    static library: IInteractable[] = DUMMY_LIBRARY;
    dom: IInteractable[] = [];
    static wbWorker: Worker;

    static get() {

        if (this.instance == null) {
            this.instance = new UnityEngine();
            console.log("New wbWorker Instance");
            this.wbWorker = new Worker(new URL('./worker.ts', import.meta.url))
        }

        return this.instance;
    }

    TAG: string = "UnityEngine";

    constructor() {
        super(wspath);
        console.log("New wbWorker Instance", wspath);
        console.log("Created", this.TAG);
    }

    init() {
        console.log("[Core]", this.TAG, "init");

        window.editor.signals.loadControlLibrary = new signals.Signal();
        window.editor.signals.loadControlLibrary.add((data: IInteractable[]) => {
            console.log("[Core]", this.TAG, "loadControlLibrary", data);
            this.dom = data;
        })

        UnityEngine.wbWorker.addEventListener("message", (event: IEvent) => {

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
        console.log('call ping')
        setInterval(() => {
            const message: IMessage = {
                signal: Signals.SYNC,
                text: "SYNC"
            }
            console.log("Send from UI...", message);
            UnityEngine.wbWorker.postMessage(message);

        }, 1000);
    }

}

