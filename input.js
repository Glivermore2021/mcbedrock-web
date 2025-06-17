// input.js

export class InputManager {
  constructor(onChange) {
    this.onChange = onChange;
    this.keys = {
      KeyW: false,
      KeyA: false,
      KeyS: false,
      KeyD: false,
      Space: false,
    };

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);

    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
  }

  handleKeyDown(e) {
    if (e.code in this.keys) {
      if (!this.keys[e.code]) {
        this.keys[e.code] = true;
        this.emitChange();
      }
      e.preventDefault();
    }
  }

  handleKeyUp(e) {
    if (e.code in this.keys) {
      if (this.keys[e.code]) {
        this.keys[e.code] = false;
        this.emitChange();
      }
      e.preventDefault();
    }
  }

  emitChange() {
    const inputState = {
      forward: this.keys.KeyW,
      backward: this.keys.KeyS,
      left: this.keys.KeyA,
      right: this.keys.KeyD,
      jump: this.keys.Space,
    };
    this.onChange(inputState);
  }

  dispose() {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
  }
}
