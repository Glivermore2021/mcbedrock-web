// player.js

const GRAVITY = -0.01;
const JUMP_VELOCITY = 0.18;
const MOVE_SPEED = 0.05;

export class Player {
  constructor(world, camera) {
    this.world = world;
    this.camera = camera;

    this.position = { x: 8, y: 2, z: 8 };
    this.velocity = { x: 0, y: 0, z: 0 };

    this.input = {
      forward: false,
      back: false,
      left: false,
      right: false,
      jump: false
    };

    this.onGround = false;

    this.setupControls();
  }

  setupControls() {
    document.addEventListener('keydown', e => {
      if (e.code === 'KeyW') this.input.forward = true;
      if (e.code === 'KeyS') this.input.back = true;
      if (e.code === 'KeyA') this.input.left = true;
      if (e.code === 'KeyD') this.input.right = true;
      if (e.code === 'Space') this.input.jump = true;
    });

    document.addEventListener('keyup', e => {
      if (e.code === 'KeyW') this.input.forward = false;
      if (e.code === 'KeyS') this.input.back = false;
      if (e.code === 'KeyA') this.input.left = false;
      if (e.code === 'KeyD') this.input.right = false;
      if (e.code === 'Space') this.input.jump = false;
    });
  }

  update() {
    const forward = this.camera.getForwardVector();
    const right = this.camera.getRightVector();

    let moveX = 0, moveZ = 0;

    if (this.input.forward) {
      moveX += forward.x;
      moveZ += forward.z;
    }
    if (this.input.back) {
      moveX -= forward.x;
      moveZ -= forward.z;
    }
    if (this.input.left) {
      moveX -= right.x;
      moveZ -= right.z;
    }
    if (this.input.right) {
      moveX += right.x;
      moveZ += right.z;
    }

    const mag = Math.hypot(moveX, moveZ);
    if (mag > 0) {
      moveX = (moveX / mag) * MOVE_SPEED;
      moveZ = (moveZ / mag) * MOVE_SPEED;
    }

    this.velocity.x = moveX;
    this.velocity.z = moveZ;

    this.velocity.y += GRAVITY;

    // Jumping
    if (this.onGround && this.input.jump) {
      this.velocity.y = JUMP_VELOCITY;
    }

    this.moveAndCollide();
  }

  moveAndCollide() {
    const next = {
      x: this.position.x + this.velocity.x,
      y: this.position.y + this.velocity.y,
      z: this.position.z + this.velocity.z
    };

    this.onGround = false;

    // Simple AABB collision, 1 block tall
    if (!this.world.isSolid(next.x, this.position.y, this.position.z)) {
      this.position.x = next.x;
    }

    if (!this.world.isSolid(this.position.x, this.position.y, next.z)) {
      this.position.z = next.z;
    }

    if (!this.world.isSolid(this.position.x, next.y, this.position.z)) {
      this.position.y = next.y;
    } else {
      // Hit floor or ceiling
      if (this.velocity.y < 0) this.onGround = true;
      this.velocity.y = 0;
    }
  }

  getPosition() {
    return this.position;
  }
}
