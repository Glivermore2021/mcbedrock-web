// world.js

export class World {
  constructor(width = 64, height = 32, depth = 64) {
    this.width = width;
    this.height = height;
    this.depth = depth;

    // 3D array of block IDs (strings like "air", "grass_block", etc)
    // Stored as a flat Uint16Array or Array? For now, simple Array of strings
    this.blocks = new Array(width * height * depth).fill('air');

    this.initTerrain();
  }

  index(x, y, z) {
    return y * this.width * this.depth + z * this.width + x;
  }

  inBounds(x, y, z) {
    return (
      x >= 0 && x < this.width &&
      y >= 0 && y < this.height &&
      z >= 0 && z < this.depth
    );
  }

  getBlock(x, y, z) {
    if (!this.inBounds(x, y, z)) return 'air';
    return this.blocks[this.index(x, y, z)];
  }

  setBlock(x, y, z, blockId) {
    if (!this.inBounds(x, y, z)) return;
    this.blocks[this.index(x, y, z)] = blockId;
  }

  initTerrain() {
    // Simple flat terrain: grass on y=10, dirt below, air above
    const groundLevel = 10;

    for (let x = 0; x < this.width; x++) {
      for (let z = 0; z < this.depth; z++) {
        for (let y = 0; y < this.height; y++) {
          if (y < groundLevel - 3) {
            this.setBlock(x, y, z, 'stone');
          } else if (y < groundLevel - 1) {
            this.setBlock(x, y, z, 'dirt');
          } else if (y === groundLevel - 1) {
            this.setBlock(x, y, z, 'grass_block');
          } else {
            this.setBlock(x, y, z, 'air');
          }
        }
      }
    }
  }
}
