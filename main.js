import { Renderer } from './renderer.js';
import { PackLoader } from './pack-loader.js';

const canvas = document.getElementById('game-canvas');
const dropzone = document.getElementById('dropzone');

let renderer = null;
let packLoader = null;

async function init() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  renderer = new Renderer(canvas);
  packLoader = new PackLoader();

  // Load default placeholder textures (solid colors)
  await renderer.loadPlaceholderTextures();

  // Start rendering loop
  renderer.start();

  setupEventListeners();
}

function setupEventListeners() {
  // Drag events for dropzone highlight
  dropzone.addEventListener('dragenter', e => {
    e.preventDefault();
    dropzone.classList.add('dragover');
  });
  dropzone.addEventListener('dragover', e => {
    e.preventDefault();
    dropzone.classList.add('dragover');
  });
  dropzone.addEventListener('dragleave', e => {
    e.preventDefault();
    dropzone.classList.remove('dragover');
  });
  dropzone.addEventListener('drop', async e => {
    e.preventDefault();
    dropzone.classList.remove('dragover');

    const files = e.dataTransfer.files;
    if (files.length === 0) return;

    for (const file of files) {
      const name = file.name.toLowerCase();
      if (name.endsWith('.zip') || name.endsWith('.mcpack')) {
        // Load resource pack zip
        const arrayBuffer = await file.arrayBuffer();
        const textures = await packLoader.loadPackFromBuffer(arrayBuffer);
        if (textures) {
          renderer.updateTextures(textures);
          dropzone.textContent = `Loaded resource pack: ${file.name}`;
        }
      } else if (name.endsWith('.mcstructure')) {
        // TODO: Load structure
        dropzone.textContent = `Structure loading not implemented yet.`;
      } else {
        dropzone.textContent = `Unsupported file type: ${file.name}`;
      }
    }
  });

  // ESC key resets to placeholders
  window.addEventListener('keydown', async e => {
    if (e.key === 'Escape') {
      await renderer.loadPlaceholderTextures();
      dropzone.textContent = 'Resource pack reset to placeholders.';
    }
  });

  // Resize canvas on window resize
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    renderer.resize();
  });
}

init();