import { EWindow } from "../engine/engine-sdk";
import { UnityEngine } from "./engine-worker";

declare let window: EWindow;

console.log("[Core] Service client script!");
window.engineWorker = UnityEngine.get();
window.engineWorker.ping();
