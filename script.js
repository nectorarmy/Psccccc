const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let layers = [];
let layerFilters = [];
let currentLayer = 0;
let brushActive = false;

function toggleMenu(id) {
  closeMenus();
  document.getElementById(id).classList.remove("hidden");
}

function closeMenus() {
  ["filtersMenu", "contrastMenu", "saturationMenu"].forEach(id =>
    document.getElementById(id).classList.add("hidden")
  );
}

function applyFilters() {
  layerFilters[currentLayer] = {
    blur: parseFloat(document.getElementById("blurRange").value),
    contrast: parseInt(document.getElementById("contrastRange").value),
    saturation: parseInt(document.getElementById("saturationRange").value),
  };
  renderLayers();
}

function toggleMenu(id) {
  const menu = document.getElementById(id);
  menu.classList.toggle("show");
}

function uploadImage(e) {
  const img = new Image();
  img.onload = () => addLayer(img);
  img.src = URL.createObjectURL(e.target.files[0]);
}

function addLayer(image = null) {
  const layerCanvas = document.createElement("canvas");
  layerCanvas.width = canvas.width;
  layerCanvas.height = canvas.height;
  const layerCtx = layerCanvas.getContext("2d");
  if (image) layerCtx.drawImage(image, 0, 0, canvas.width, canvas.height);

  layers.push(layerCanvas);
  layerFilters.push({ blur: 0, contrast: 100, saturation: 100 });
  currentLayer = layers.length - 1;
  renderLayers();
  updateLayerList();
}

function duplicateLayer() {
  const original = layers[currentLayer];
  const dupCanvas = document.createElement("canvas");
  dupCanvas.width = original.width;
  dupCanvas.height = original.height;
  dupCanvas.getContext("2d").drawImage(original, 0, 0);

  layers.push(dupCanvas);
  layerFilters.push({ ...layerFilters[currentLayer] });
  currentLayer = layers.length - 1;
  updateLayerList();
  renderLayers();
}

function updateLayerList() {
  const list = document.getElementById("layerList");
  list.innerHTML = "";
  layers.forEach((_, i) => {
    const btn = document.createElement("button");
    btn.className = `layer-btn ${i === currentLayer ? 'active' : ''}`;
    btn.innerText = `Layer ${i + 1}`;
    btn.onclick = () => {
      currentLayer = i;
      updateLayerList();
      document.getElementById("blurRange").value = layerFilters[i].blur;
      document.getElementById("contrastRange").value = layerFilters[i].contrast;
      document.getElementById("saturationRange").value = layerFilters[i].saturation;
    };
    list.appendChild(btn);
  });
}

function renderLayers() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < layers.length; i++) {
    const f = layerFilters[i];
    ctx.filter = `blur(${f.blur}px) contrast(${f.contrast}%) saturate(${f.saturation}%)`;
    ctx.drawImage(layers[i], 0, 0);
  }
  ctx.filter = "none";
}

function selectBrush() {
  brushActive = !brushActive;
  document.getElementById("brushMenu").classList.toggle("hidden");
}

function getEventPos(ev) {
  const rect = canvas.getBoundingClientRect();
  if (ev.touches) {
    return { x: ev.touches[0].clientX - rect.left, y: ev.touches[0].clientY - rect.top };
  }
  return { x: ev.clientX - rect.left, y: ev.clientY - rect.top };
}

function startDrawing(ev) {
  if (!brushActive) return;
  ev.preventDefault();
  const layerCtx = layers[currentLayer].getContext("2d");
  const size = document.getElementById("brushSize").value;
  const color = document.getElementById("brushColor").value;
  layerCtx.lineWidth = size;
  layerCtx.strokeStyle = color;
  layerCtx.lineCap = "round";
  layerCtx.beginPath();

  function move(e) {
    const pos = getEventPos(e);
    layerCtx.lineTo(pos.x, pos.y);
    layerCtx.stroke();
    renderLayers();
  }

  const start = getEventPos(ev);
  layerCtx.moveTo(start.x, start.y);
  canvas.addEventListener("mousemove", move);
  canvas.addEventListener("touchmove", move);

  window.addEventListener("mouseup", () => {
    canvas.removeEventListener("mousemove", move);
  }, { once: true });

  window.addEventListener("touchend", () => {
    canvas.removeEventListener("touchmove", move);
  }, { once: true });
}

canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("touchstart", startDrawing);



/* zoom */
  
 
 let zoomLevel = 1;

function zoomIn() {
  zoomLevel += 0.1;
  updateCanvasZoom();
}

function zoomOut() {
  zoomLevel = Math.max(0.1, zoomLevel - 0.1);
  updateCanvasZoom();
}

function updateCanvasZoom() {
  const canvas = document.getElementById("canvas");
  canvas.style.transform = `scale(${zoomLevel})`;
  canvas.style.transformOrigin = "center center";
}

canvas.style.transform = `scale(${zoomLevel})`;


/* popup */
 
 function saveImage() {
  // your logic to export or trigger download
}

function showHdPopup() {
  // your logic to display HD+ modal
}
