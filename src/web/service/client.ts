import { IUnityEngine } from "../engine/engine-sdk";
import { UnityEngine } from "./engine-worker";

console.log("Started the service cliente");

const worker: IUnityEngine = UnityEngine.getWorker();
worker.ping();
worker.import();
console.log(worker);