/**
 * DDS Texture Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Vendor/MSFT_texture_dds
 *
 */
 export default class GLTFMRTKExtension {
    name: string;
    parser: any;
    loader: any;

    constructor(parser: any, loader: any) {
      this.name = 'mrtk_extension';
      this.parser = parser;
      this.loader = loader;
    }

    loadInteractable(nodeIndex: string | number) {
      const json = this.parser.json;
      const nodeDef = json.nodes[nodeIndex];
      if (!nodeDef.extensions || !nodeDef.extensions[this.name]) {
        return null;
      }
      const extensionDef = nodeDef.extensions[this.name];
      const source = json.images[extensionDef.source]; // ¿¿
      //return this.parser.loadTextureImage(nodeIndex, source, this.loader);
      return extensionDef;
    }
  }