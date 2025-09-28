window.SpaceIntruders = window.SpaceIntruders || {};

(function registerInputManager() {
  class InputManager {
    constructor() {
      this.keysDown = new Set();
      this.justPressed = new Set();
      this._handleKeyDown = this._handleKeyDown.bind(this);
      this._handleKeyUp = this._handleKeyUp.bind(this);
      window.addEventListener('keydown', this._handleKeyDown);
      window.addEventListener('keyup', this._handleKeyUp);
    }

    _handleKeyDown(event) {
      const code = event.code;
      if (['ArrowLeft', 'ArrowRight', 'Space', 'ArrowUp', 'ArrowDown', 'KeyA', 'KeyD'].includes(code)) {
        event.preventDefault();
      }
      if (!this.keysDown.has(code)) {
        this.justPressed.add(code);
      }
      this.keysDown.add(code);
    }

    _handleKeyUp(event) {
      this.keysDown.delete(event.code);
      this.justPressed.delete(event.code);
    }

    getHorizontalAxis() {
      let axis = 0;
      if (this.isPressed('ArrowLeft') || this.isPressed('KeyA')) {
        axis -= 1;
      }
      if (this.isPressed('ArrowRight') || this.isPressed('KeyD')) {
        axis += 1;
      }
      return axis;
    }

    isPressed(code) {
      return this.keysDown.has(code);
    }

    wasJustPressed(code) {
      return this.justPressed.has(code);
    }

    isFirePressed() {
      return this.isPressed('Space');
    }

    tick() {
      this.justPressed.clear();
    }

    dispose() {
      window.removeEventListener('keydown', this._handleKeyDown);
      window.removeEventListener('keyup', this._handleKeyUp);
      this.keysDown.clear();
      this.justPressed.clear();
    }
  }

  window.SpaceIntruders.InputManager = InputManager;
})();
