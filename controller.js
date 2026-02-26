// Controller for visual board pan and zoom interactions
// Handles mouse events for panning, zooming, and click suppression after drag
//
const visualBoard = document.getElementById("visual-board"); // Board element to manipulate

let zoom = 1; // Current zoom level
let min_zoom = 0.2;
let max_zoom = 10;

let panX = 0, // Current pan offset X
  panY = 0; // Current pan offset Y
let isPanning = false; // True if mouse is dragging for pan
let startX, startY, startPanX, startPanY; // Track drag start positions
let dragThreshold = 5; // Minimum movement to count as drag
let hasDragged = false; // True if drag threshold exceeded

// Apply pan and zoom transforms to the board
function updateTransform() {
  visualBoard.style.transform = `translate(${panX}px, ${panY}px) scale(${zoom})`;
  visualBoard.style.transformOrigin = "center center";
}

// Handle mouse wheel for zooming, keeping zoom centered on mouse
// Adjust pan so zoom focuses on mouse position
// Clamp zoom
// Prevent default scroll behavior
// Update transform after zoom
// 'passive: false' allows preventDefault
// Board stays centered visually

document.addEventListener(
  "wheel",
  (event) => {
    event.preventDefault();
    const rect = visualBoard.getBoundingClientRect();
    const prevZoom = zoom;
    zoom += event.deltaY * -0.001;
    zoom = Math.max(min_zoom, Math.min(zoom, max_zoom));
    const mouseX = event.clientX;
    const mouseY = event.clientY;
    const boardCenterX = rect.left + rect.width / 2;
    const boardCenterY = rect.top + rect.height / 2;
    const offsetX = mouseX - boardCenterX;
    const offsetY = mouseY - boardCenterY;
    panX -= offsetX * (zoom / prevZoom - 1);
    panY -= offsetY * (zoom / prevZoom - 1);
    updateTransform();
  },
  { passive: false },
);

// Start panning on mouse down
// Record initial mouse and pan positions
visualBoard.addEventListener("mousedown", (e) => {
  isPanning = true;
  hasDragged = false;
  startX = e.clientX;
  startY = e.clientY;
  startPanX = panX;
  startPanY = panY;
});

// On mouse move, if panning, update pan offsets
// Only start panning if movement exceeds dragThreshold
// Update transform as user drags

document.addEventListener("mousemove", (e) => {
  if (!isPanning) return;
  const dx = e.clientX - startX;
  const dy = e.clientY - startY;
  if (
    !hasDragged &&
    (Math.abs(dx) > dragThreshold || Math.abs(dy) > dragThreshold)
  ) {
    hasDragged = true;
  }
  if (hasDragged) {
    panX = startPanX + dx;
    panY = startPanY + dy;
    updateTransform();
  }
});

// Stop panning on mouse up

document.addEventListener("mouseup", (e) => {
  isPanning = false;
});

// Suppress click event if a drag occurred
// Prevents accidental clicks after dragging
visualBoard.addEventListener(
  "click",
  (e) => {
    if (hasDragged) {
      e.stopImmediatePropagation();
      e.preventDefault();
    }
  },
  true,
);
