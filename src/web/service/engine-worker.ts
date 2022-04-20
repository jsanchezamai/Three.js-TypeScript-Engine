import { DUMMY_LIBRARY, IEngine, IInteractable, IMessage, IUnityEngine, IWorker, Signals } from "../engine/engine-sdk";

const worker = new Worker(new URL('./worker.ts', import.meta.url));

export class UnityEngine extends Worker implements IUnityEngine {

    static wbWorker = worker;
    static worker: UnityEngine = new UnityEngine();
    static library: IInteractable[] = DUMMY_LIBRARY;
    dom: IInteractable[] = [];

    static getWorker() {
        return UnityEngine.worker;
    }

    TAG: string = "UnityEngine";

    constructor() {
        super('../service/src_web_service_worker_ts.engine-worker.js');
        console.log("Created", this.TAG);
    }

    import(): boolean {

        // dummy
        this.dom = UnityEngine.library;
        return true;
    }

    export(): boolean {
        return true;
    }

    ping() {

        worker.addEventListener("message", (event) => {

            console.log("[Core]", this.TAG, "addEventListener", event.data.text);


        });

        setInterval(() => {

            const message: IMessage = {
                signal: Signals.SYNC,
                text: "sync"
            }

            worker.postMessage(message);

        }, 5000);
    }

}

