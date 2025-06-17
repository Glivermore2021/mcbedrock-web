// pack-loader.js

export class PackLoader {
  constructor() {
    if (!window.JSZip) throw new Error('JSZip not found! Make sure lib/jszip.min.js is included.');
  }

  async loadPackFromBuffer(arrayBuffer) {
    try {
      const zip = await window.JSZip.loadAsync(arrayBuffer);

      // Bedrock packs usually store block textures under textures/blocks/
      const textureFolder = 'textures/blocks/';

      const textures = new Map();

      // Iterate files in the zip folder
      const files = Object.values(zip.files);
      const imageFiles = files.filter(f => !f.dir && f.name.toLowerCase().startsWith(textureFolder) && /\.(png|jpg|jpeg)$/i.test(f.name));

      if (imageFiles.length === 0) {
        console.warn('No block textures found in the pack.');
        return null;
      }

      // Load each image as an HTMLImageElement
      for (const file of imageFiles) {
        // Extract filename without folder and extension, e.g. "stone.png" -> "stone"
        const fileName = file.name.substring(textureFolder.length);
        const blockName = fileName.replace(/\.(png|jpg|jpeg)$/i, '');

        // Load image data as Blob URL
        const imgData = await file.async('blob');
        const imgURL = URL.createObjectURL(imgData);

        const img = await this.loadImage(imgURL);

        URL.revokeObjectURL(imgURL); // cleanup

        textures.set(blockName, img);
      }

      return textures;
    } catch (e) {
      console.error('Failed to load pack:', e);
      return null;
    }
  }

  loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }
}