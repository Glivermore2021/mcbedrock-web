// structure-loader.js

export class StructureLoader {
  constructor() {
    if (!window.JSZip) throw new Error('JSZip not found! Make sure lib/jszip.min.js is included.');
  }

  async loadFromBuffer(arrayBuffer) {
    const zip = await window.JSZip.loadAsync(arrayBuffer);
    // The key file is usually 'structure.block' (binary format)
    const structFile = zip.file('structure.block');

    if (!structFile) {
      console.warn('structure.block not found in archive.');
      return null;
    }

    const buffer = await structFile.async('arraybuffer');
    return this.parseStructureBlock(buffer);
  }

  parseStructureBlock(buffer) {
    // structure.block binary format is documented at:
    // https://wiki.vg/Bedrock_edition_level_format#Structure_Block

    // For simplicity, here we parse the basic blocks list
    // We'll ignore palettes and extra data for now

    const data = new DataView(buffer);
    let offset = 0;

    // Read magic header (4 bytes)
    const magic = String.fromCharCode(
      data.getUint8(offset++),
      data.getUint8(offset++),
      data.getUint8(offset++),
      data.getUint8(offset++)
    );
    if (magic !== 'SDBK') {
      console.error('Invalid structure.block magic header:', magic);
      return null;
    }

    // Skip version (4 bytes)
    offset += 4;

    // Read block count (varint - here we read 4 bytes int for simplicity)
    const blockCount = data.getUint32(offset, true);
    offset += 4;

    // Blocks are stored with:
    // Each block: int32 x, int32 y, int32 z, string block name length + block name UTF8 bytes

    const blocks = [];

    for (let i = 0; i < blockCount; i++) {
      const x = data.getInt32(offset, true); offset += 4;
      const y = data.getInt32(offset, true); offset += 4;
      const z = data.getInt32(offset, true); offset += 4;

      const nameLength = data.getUint16(offset, true);
      offset += 2;

      // Read UTF8 string block name
      let blockName = '';
      for (let j = 0; j < nameLength; j++) {
        blockName += String.fromCharCode(data.getUint8(offset++));
      }

      blocks.push({ x, y, z, blockId: blockName });
    }

    return blocks;
  }
}
