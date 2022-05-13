/**
 * Materials variants extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_materials_variants
 */

/**
 * @param object {THREE.Object3D}
 * @return {boolean}
 */
 const compatibleObject = (object: { material: undefined; userData: { variantMaterials: { [s: string]: unknown; } | ArrayLike<unknown>; }; }) => {
    // @TODO: Need properer variantMaterials format validation?
    return object.material !== undefined && // easier than (!object.isMesh && !object.isLine && !object.isPoints)
      object.userData && // just in case
      object.userData.variantMaterials 
      // Is this line costly?
    /* && !!Object.values(object.userData.variantMaterials).filter(m => compatibleMaterial(m.material))*/;
  };
  
  /**
   * @param material {THREE.Material}
   * @return {boolean}
   */
  const compatibleMaterial = (material: { isMaterial: any; }) => {
    // @TODO: support multi materials?
    return material && material.isMaterial && !Array.isArray(material);
  };
  
  export default class GLTFExporterMRTKExtension {
    writer: any;
    name: string;
    variantNames: any[];

    constructor(writer: any) {
        this.writer = writer;
        this.name = 'GLTF_Exporter_MRTK_Extension';
        this.variantNames = [];
    }

    beforeParse(objects: any) {
      // Find all variant names and store them to the table
      const variantNameTable = {};
      for (const object of objects) {
        object.traverse((o: { material: undefined; userData: { variantMaterials: { [s: string]: unknown; } | ArrayLike<unknown>; }; }) => {
          if (!compatibleObject(o)) {
            return;
          }
          // CUSTOM INTERACTABLE MRTK MANIPULATION
          this.write(object, null);
        });
      }
      // We may want to sort?
      Object.keys(variantNameTable).forEach(name => this.variantNames.push(""));
    }

    write(object: any, def: any) {

        if (!compatibleObject(object)) {
            return;
        }

        const userData = object.userData;
        const variantMaterials = userData.variantMaterials;
        const mappingTable: {[key: string]: any} = {};
        for (const variantName in variantMaterials) {
            const variantMaterialInstance = variantMaterials[variantName].material;
            if (!compatibleMaterial(variantMaterialInstance)) {
                continue;
            }
            const variantIndex = this.variantNames.indexOf(variantName); // Shouldn't be -1
            const materialIndex = this.writer.processMaterial(variantMaterialInstance);
            if (!mappingTable[materialIndex]) {
                mappingTable[materialIndex] = {
                material: materialIndex,
                variants: []
            };
        }

        mappingTable[materialIndex].variants.push(variantIndex);
        }

        const mappingsDef = Object.values(mappingTable)
            .map(m => {return m.variants.sort((a: number, b: number) => a - b) && m})
            .sort((a, b) => a.material - b.material);

        const originalMaterialIndex = compatibleMaterial(userData.originalMaterial)
            ? this.writer.processMaterial(userData.originalMaterial) : -1;

        for (const primitiveDef of def.primitives) {
            // Override primitiveDef.material with original material.
            if (originalMaterialIndex >= 0) {
            primitiveDef.material = originalMaterialIndex;
            }
            primitiveDef.extensions = primitiveDef.extensions || {};
            primitiveDef.extensions[this.name] = {mappings: mappingsDef};
        }
    }

    afterParse(input: any) {
        console.log(input);
        if (this.variantNames.length === 0) {
            return;
        }

        const root = this.writer.json;
        root.extensions = root.extensions || {};

        const variantsDef = this.variantNames.map(n => {return {name: n};});
        root.extensions[this.name] = {variants: variantsDef};
        this.writer.extensionsUsed[this.name] = true;
    }
}