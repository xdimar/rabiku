/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

function patchFile(relPath) {
  const filePath = path.resolve(__dirname, '..', relPath);
  if (!fs.existsSync(filePath)) {
    console.log('File not found: ' + filePath);
    return;
  }
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Patch 1: getZoomConfig protection against 0 or NaN
  if (content.includes('const { width: frameWidth, height: frameHeight } = box.contentBox;')) {
    content = content.replace(
      'if (typeof uiViewport.width === "number" && (uiViewport.width > frameWidth || viewportHeight > frameHeight)) {',
      'if (typeof uiViewport.width === "number" && frameWidth > 0 && viewportHeight > 0 && (uiViewport.width > frameWidth || viewportHeight > frameHeight)) {'
    );
    content = content.replace(
      'return { autoZoom, rootHeight, zoom };',
      'if (typeof zoom !== "number" || isNaN(zoom) || zoom <= 0) { zoom = 1; autoZoom = 1; }\n      return { autoZoom, rootHeight, zoom };'
    );
    changed = true;
  }

  // Patch 2: actionsOverlayTop / zoom protection
  const oldOverlay = 'top: actionsOverlayTop / zoom';
  if (content.includes(oldOverlay)) {
    content = content.split(oldOverlay).join('top: (typeof zoom === "number" && !isNaN(zoom) && zoom > 0) ? actionsOverlayTop / zoom : actionsOverlayTop');
    changed = true;
  }
  const oldActionsTop = 'top: actionsTop / zoom';
  if (content.includes(oldActionsTop)) {
    content = content.split(oldActionsTop).join('top: (typeof zoom === "number" && !isNaN(zoom) && zoom > 0) ? actionsTop / zoom : actionsTop');
    changed = true;
  }

  // Patch 3: s.zoomConfig.zoom NaN guard
  const oldZoomSelect = 'props.id) === id ? s.zoomConfig.zoom : 1;';
  if (content.includes(oldZoomSelect)) {
    content = content.split(oldZoomSelect).join('props.id) === id ? (typeof s.zoomConfig.zoom === "number" && !isNaN(s.zoomConfig.zoom) && s.zoomConfig.zoom > 0 ? s.zoomConfig.zoom : 1) : 1;');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Successfully patched ' + relPath);
  } else {
    console.log('No changes needed in ' + relPath);
  }
}

patchFile('node_modules/@puckeditor/core/dist/chunk-K2LNXU54.mjs');
patchFile('node_modules/@puckeditor/core/dist/chunk-55V3NZVF.mjs');
patchFile('node_modules/@puckeditor/core/dist/no-external.js');
patchFile('node_modules/@puckeditor/core/dist/index.js');
