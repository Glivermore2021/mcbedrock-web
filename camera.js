// camera.js

export class Camera {
  constructor() {
    // Angles in radians
    this.yaw = 0;    // rotation around Y axis (left/right)
    this.pitch = 0;  // rotation around X axis (up/down)

    // Sensitivity for mouse movement
    this.sensitivity = 0.002;

    this.isPointerLocked = false;

    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handlePointerLockChange = this.handlePointerLockChange.bind(this);
    
    document.addEventListener('pointerlockchange', this.handlePointerLockChange);
  }

  attach(canvas) {
    canvas.addEventListener('click', () => {
      canvas.requestPointerLock();
    });

    document.addEventListener('mousemove', this.handleMouseMove);
  }

  handlePointerLockChange() {
    this.isPointerLocked = document.pointerLockElement !== null;
  }

  handleMouseMove(e) {
    if (!this.isPointerLocked) return;

    this.yaw -= e.movementX * this.sensitivity;
    this.pitch -= e.movementY * this.sensitivity;

    // Clamp pitch between -89 and +89 degrees (~±1.55 radians)
    const maxPitch = Math.PI / 2 - 0.01;
    if (this.pitch > maxPitch) this.pitch = maxPitch;
    if (this.pitch < -maxPitch) this.pitch = -maxPitch;
  }

  // Get forward vector from yaw/pitch
  getForwardVector() {
    return {
      x: Math.cos(this.pitch) * Math.sin(this.yaw),
      y: Math.sin(this.pitch),
      z: Math.cos(this.pitch) * Math.cos(this.yaw),
    };
  }

  // Get right vector (perpendicular to forward)
  getRightVector() {
    return {
      x: Math.sin(this.yaw - Math.PI / 2),
      y: 0,
      z: Math.cos(this.yaw - Math.PI / 2),
    };
  }

  // Optionally, you can create a view matrix here for WebGL if needed
}
