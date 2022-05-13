import * as signals from "signals";
import { DUMMY_LIBRARY, EWindow, IEditorITeractable, IInteractable, IMessage, IUnityEngine, Signals } from "../engine/engine-sdk";
import { Handler } from "./worker";
import * as THREE from 'three';
import GLTFMRTKExtension from "./gltf-plugins/loaders/mrtk_extension/mrtk-extension";
import { GltfLoader, GltfAsset } from 'gltf-loader-ts';
import { log } from "console";
import GLTFExporterMRTKExtension from "./gltf-plugins/exporters/mrtk_extension/mrtk_extension_exporter";

/**
 * Vendor Extensions for glTF 2.0
The list of vendor prefixes is maintained in Prefixes.md. Any vendor, not just Khronos members, 
can request an extension prefix by submitting an issue on GitHub requesting one. Requests should 
include:
https://github.com/KhronosGroup/glTF/blob/main/extensions/Prefixes.md
https://github.com/KhronosGroup/glTF/issues/new

The name of the prefix. --> MRTK
The name of the vendor requesting the prefix. --> InsightAR
The vendor's URL and/or contact information. --> InsightAR Contact

MRTK_Interactable
MRTK_PressableButton
MRTK_Slider

*/

/**
 * Add mrtk_extensions to ThreeJs Gltf Loader/Exporter
 * See methods {@link UnityEngine} import export
 * https://github.com/mrdoob/three-gltf-plugins
 */



declare let window: EWindow;

export interface IEvent { data: IMessage }

export class Worker {

    worker: Handler;

    constructor(url: String | URL) {
        this.worker = new Handler();
    }

    addEventListener(message: string, callback: (event: IEvent) => void) {
        this.worker.listeners.push({ message, callback });
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
    domGltf: IEditorITeractable | undefined;
    static wbWorker: Worker;

    /**
     * Communication with UI Editor. Signals must be registered in UIEditor.
     */
    signals: {[key: string]: signals.Signal} = {};

    static get() {

        if (this.instance == null) {
            this.instance = new UnityEngine();
            console.log("New wbWorker Instance");
            this.wbWorker = new Worker(new URL('./worker.ts', import.meta.url))
        }

        return this.instance;
    }

    TAG: string = "UnityEngineWorker";

    constructor() {
        super(wspath);
        console.log("[Core]", this.TAG, "New wbWorker Instance", wspath);
        console.log("Created", this.TAG);
    }
    import(path_to_gltf_asset?: string): boolean;
    import(path_to_gltf_asset?: string): Promise<boolean>;
    import(path_to_gltf_asset?: any): boolean | Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    init() {
        console.log("[Core]", this.TAG, "init");

        this.signals.loadControlLibrary = new signals.Signal();
        this.signals.loadControlLibrary.add((data: IInteractable[]) => {
            console.log("[Core]", this.TAG, "loadControlLibrary. SIGNAL SENT TO UI EDITOR", data);
            this.dom = data;

            // Simulate editor ui manipulation
            this.dom[0].BoxCollider.customDistanceMaterial.opacity = 1;

            // Export a manipulated dom back to gltf-mrtk
            this.signals.saveControlLibrary.dispatch(this.dom);
        })

        this.signals.saveControlLibrary = new signals.Signal();
        this.signals.saveControlLibrary.add((data: IInteractable[]) => {
            console.log("[Core]", this.TAG, "saveControlLibrary. SIGNAL SENT FROM UI EDITOR", data);
            const message: IMessage = {
                signal: Signals.EXPORT_CONTROL_LIBRARY,
                text: "EXPORT_CONTROL_LIBRARY",
                params: this.dom
            }
            UnityEngine.wbWorker.postMessage(message);
        })

        UnityEngine.wbWorker.addEventListener("message", (event: IEvent) => {

            console.log("[Core]", this.TAG, "addEventListener", event.data);
            switch(event.data.signal) {
                case Signals.IMPORTED_CONTROL_LIBRARY:
                    const dom = JSON.parse(event.data.params);
                    console.log("[Core]", this.TAG, "IMPORTED_CONTROL_LIBRARY", event.data);
                    this.signals.loadControlLibrary.dispatch(dom);
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
                    console.log("[Core]",this.TAG, "onmessage", "NOT IMPLEMENTED event.data.signal",
                    Signals[event.data.signal], event);
            }

        });

        const message: IMessage = {
            signal: Signals.IMPORT_CONTROL_LIBRARY,
            text: "IMPORT_CONTROL_LIBRARY"
        }
        UnityEngine.wbWorker.postMessage(message);
    }

    async import2(path_to_gltf_asset: any): Promise<boolean> {

        /**
         * Types way
         */
        let loader = new GltfLoader();
        let uri = path_to_gltf_asset;
        let asset: GltfAsset = await loader.load(uri);
        let gltf = asset.gltf;
        console.log(gltf);
        // -> {asset: {…}, scene: 0, scenes: Array(1), nodes: Array(2), meshes: Array(1), …}
        const action = (parser: any) => new GLTFMRTKExtension(parser, loader);

        let data = await asset.accessorData(0); // fetches BoxTextured0.bin

        /**
         * Types way
         */
        // Register the plugin to the loader and then load glTF
        /*const loader = new GLTFLoader();
        loader.register((parser: any) => new GLTFMRTKExtension(parser, loader));
        loader.load(path_to_gltf_asset, (gltf: any) => {
            console.log(this.TAG, "import x", gltf)
        });*/
        return true;
    }

    export(dom: IInteractable[]): boolean {
        // Register the plugin to the exporter and then export Three.js objects
        /*const exporter = new GLTFExporter();
        exporter.register((writer: any) => new GLTFExporterMRTKExtension(writer));
        exporter.parse(dom, (result: any) => {
         console.log(result);
        });*/
        return true;
    }

    ping(timems: number) {
        console.log('call ping')
        setInterval(() => {
            const message: IMessage = {
                signal: Signals.SYNC,
                text: "SYNC"
            }
            console.log("Send from UI...", message);
            UnityEngine.wbWorker.postMessage(message);

        }, timems);
    }

}

