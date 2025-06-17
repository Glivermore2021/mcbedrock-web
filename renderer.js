// renderer.js

export class Renderer {
  constructor(canvas, world, player, blockRegistry) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.world = world;
    this.player = player;
    this.blockRegistry = blockRegistry;

    this.blockSize = 20; // Size of blocks on screen
    this.viewDistance = 16; // Blocks visible around player
  }

  render() {
    const { ctx, canvas } = this;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const px = Math.floor(this.player.position.x);
    const py = Math.floor(this.player.position.y);
    const pz = Math.floor(this.player.position.z);

    this.world.forEachBlock((x, y, z, blockId) => {
      // Only draw blocks near player (2D top-down style for now)
      if (Math.abs(x - px) > this.viewDistance || Math.abs(z - pz) > this.viewDistance) return;

      const def = this.blockRegistry[blockId];
      if (!def || !def.color) return;

      const screenX = centerX + (x - px) * this.blockSize;
      const screenY = centerY + (z - pz) * this.blockSize;

      ctx.fillStyle = def.color;
      ctx.fillRect(screenX, screenY, this.blockSize, this.blockSize);
    });

    // Draw player
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(centerX - 5, centerY - 5, 10, 10);
  }
}
