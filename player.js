// player.js

export class Player {
  constructor(world, spawn = { x: 32, y: 12, z: 32 }) {
    this.world = world;

    // Position & velocity
    this.pos = { x: spawn.x, y: spawn.y, z: spawn.z };
    this.vel = { x: 0, y: 0, z: 0 };

    // Player size (AABB half extents)
    this.width = 0.3;
    this.height = 1.8;

    // Movement parameters
    this.speed = 5.0; // blocks per second
    this.jumpVelocity = 7.0;
    this.gravity = -20.0;

    // Movement input flags
    this.input = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      jump: false,
    };

    this.onGround = false;
  }

  update(dt) {
    // Apply gravity
    this.vel.y += this.gravity * dt;

    // Apply horizontal movement based on input
    const dir = { x: 0, z: 0 };
    if (this.input.forward) dir.z -= 1;
    if (this.input.backward) dir.z += 1;
    if (this.input.left) dir.x -= 1;
    if (this.input.right) dir.x += 1;

    // Normalize direction vector
    const len = Math.hypot(dir.x, dir.z);
    if (len > 0) {
      dir.x /= len;
      dir.z /= len;
    }

    // Move velocity horizontally (simple)
    this.vel.x = dir.x * this.speed;
    this.vel.z = dir.z * this.speed;

    // Jump if on ground
    if (this.input.jump && this.onGround) {
      this.vel.y = this.jumpVelocity;
      this.onGround = false;
    }

    // Calculate proposed new position
    const newPos = {
      x: this.pos.x + this.vel.x * dt,
      y: this.pos.y + this.vel.y * dt,
      z: this.pos.z + this.vel.z * dt,
    };

    // Collide and resolve
    this.pos = this.collide(this.pos, newPos);

    // Check if on ground (simple: if standing on a solid block)
    this.onGround = this.isOnGround();
  }

  collide(oldPos, newPos) {
    // Simple AABB collision with world blocks, axis by axis
    let pos = { ...oldPos };

    // Check X
    pos.x = newPos.x;
    if (this.collides(pos)) pos.x = oldPos.x;

    // Check Y
    pos.y = newPos.y;
    if (this.collides(pos)) {
      if (this.vel.y < 0) this.onGround = true; // landed on ground
      this.vel.y = 0;
      pos.y = oldPos.y;
    }

    // Check Z
    pos.z = newPos.z;
    if (this.collides(pos)) pos.z = oldPos.z;

    return pos;
  }

  collides(pos) {
    // Check all blocks overlapping player's bounding box
    const minX = Math.floor(pos.x - this.width);
    const maxX = Math.floor(pos.x + this.width);
    const minY = Math.floor(pos.y);
    const maxY = Math.floor(pos.y + this.height);
    const minZ = Math.floor(pos.z - this.width);
    const maxZ = Math.floor(pos.z + this.width);

    for (let x = minX; x <= maxX; x++) {
      for (let y = minY; y <= maxY; y++) {
        for (let z = minZ; z <= maxZ; z++) {
          const block = this.world.getBlock(x, y, z);
          if (block !== 'air') return true;
        }
      }
    }
    return false;
  }

  isOnGround() {
    const feetPos = { x: this.pos.x, y: this.pos.y - 0.1, z: this.pos.z };
    return this.collides(feetPos);
  }

  // Input handlers
  setInput(input) {
    this.input = { ...this.input, ...input };
  }
}
