// world.js

export class World {
  constructor(blockRegistry) {
    this.blockRegistry = blockRegistry;

    // 3D map: Map<x, Map<y, Map<z, blockId>>>
    this.blocks = new Map();
  }

  getBlock(x, y, z) {
    return this.blocks.get(x)?.get(y)?.get(z) || "minecraft:air";
  }

  setBlock(x, y, z, blockId) {
    if (!this.blocks.has(x)) this.blocks.set(x, new Map());
    if (!this.blocks.get(x).has(y)) this.blocks.get(x).set(y, new Map());
    this.blocks.get(x).get(y).set(z, blockId);
  }

  isSolid(x, y, z) {
    const id = this.getBlock(x, y, z);
    const def = this.blockRegistry[id];
    return def && def.solid;
  }

  generateFlatChunk(width = 16, height = 8, depth = 16) {
    for (let x = 0; x < width; x++) {
      for (let z = 0; z < depth; z++) {
        this.setBlock(x, 0, z, "minecraft:grass_block");
        for (let y = -1; y >= -3; y--) {
          this.setBlock(x, y, z, "minecraft:dirt");
        }
      }
    }
  }

  forEachBlock(callback) {
    for (const [x, yzMap] of this.blocks) {
      for (const [y, zMap] of yzMap) {
        for (const [z, blockId] of zMap) {
          callback(parseInt(x), parseInt(y), parseInt(z), blockId);
        }
      }
    }
  }
}
