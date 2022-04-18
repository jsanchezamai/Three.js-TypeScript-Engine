import { IEngine } from "./engine-sdk";

export class GltfEngine implements IEngine {
    TAG: string = "";

    import(): boolean {
        return true;
    }

    export(): boolean {
        return true;
    }

}