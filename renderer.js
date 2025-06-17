// renderer.js
export class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.gl = canvas.getContext('webgl2');
    if (!this.gl) throw new Error('WebGL2 not supported');

    this.textures = new Map(); // blockName → WebGLTexture
    this.animationFrameId = null;

    this.initGL();
  }

  initGL() {
    const gl = this.gl;
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    // Setup basic GL state here if needed
  }

  start() {
    const loop = (time) => {
      this.renderFrame(time);
      this.animationFrameId = requestAnimationFrame(loop);
    };
    this.animationFrameId = requestAnimationFrame(loop);
  }

  stop() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  resize() {
    const gl = this.gl;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  }

  renderFrame(time) {
    const gl = this.gl;
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // TODO: Add voxel rendering here

    // For now, just clear to black
  }

  async loadPlaceholderTextures() {
    const placeholderColors = {
      stone: '#888888',
      dirt: '#8B4513',
      grass_block: '#228B22',
      planks: '#DEB887',
      glass: '#AAAAAA80',
      sand: '#F4E99D',
      water: '#4060F080',
    };

    for (const [block, color] of Object.entries(placeholderColors)) {
      const tex = this.createTextureFromColor(color);
      this.textures.set(block, tex);
    }
  }

  createTextureFromColor(color) {
    const gl = this.gl;
    const size = 16;

    // Create a 16x16 canvas filled with the color
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, size, size);

    // Create WebGL texture
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      canvas
    );

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    gl.bindTexture(gl.TEXTURE_2D, null);
    return texture;
  }

  // Replace textures map with new ones (loaded from resource pack)
  updateTextures(textureMap) {
    // textureMap: Map<string, HTMLImageElement>
    const gl = this.gl;
    this.textures.clear();

    for (const [block, img] of textureMap.entries()) {
      const tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);

      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        img
      );

      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

      gl.bindTexture(gl.TEXTURE_2D, null);
      this.textures.set(block, tex);
    }
  }
}