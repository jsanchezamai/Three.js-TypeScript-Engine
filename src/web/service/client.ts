import { EWindow } from "../engine/engine-sdk";
import { UnityEngine } from "./engine-worker";

declare let window: EWindow;

console.log("[Core] Service client script!");

const ew = UnityEngine.get();
window.engineWorker = ew;
ew.ping(50000);

ew.init();
