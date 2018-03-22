(function(){
  const CONFIG = {
    canvas:{
      pieceSizePx: 10,
      widthPieces: 60,
      heightPieces: 30
    },
    palette:{
      colors: [
        "#f00", "#0f0", "#00f", "#ff0", "#f0f", "#0ff",
        "#800", "#080", "#008", "#880", "#808", "#088",
        "#f80", "#8f0","#f08", "#80f", "#08f","#0f8",
        "#8ff", "#f8f","#ff8", "#f88", "#8f8","#88f",
        "#000", "#444","#888","#bbb","#fff"
      ]
    }
  }

  const canvas = document.getElementById('canvas');
  const drawingGroup = canvas.getElementsByClassName('drawing')[0];
  const gridGroup = canvas.getElementsByClassName('grid')[0];
  const caret = drawingGroup.getElementsByClassName('caret')[0];
  const svgNS = "http://www.w3.org/2000/svg";  
  const socket = new WebSocket("ws://localhost:8081");  
  const palette = document.getElementById('palette');
  const report = document.getElementById('report');

  let activeColor;

  initializeCanvas();
  initializePalette();

  canvas.addEventListener('mousemove', onCanvasMouseMove);
  canvas.addEventListener('click', onCanvasClick);
  palette.addEventListener('click', onPaletteClick);
  socket.onopen = onSocketOpen;
  socket.onmessage = onNewBitMessageReceived;
  socket.onclose = onSocketClose;
  socket.onerror = onSocketError;

  function initializeCanvas(){
    let canvasWidthPxs = CONFIG.canvas.widthPieces * CONFIG.canvas.pieceSizePx;
    let canvasHeightPxs = CONFIG.canvas.heightPieces * CONFIG.canvas.pieceSizePx;
    canvas.setAttribute('width',  canvasWidthPxs);
    canvas.setAttribute('height', canvasHeightPxs);

    // add vertical lines
    for(let i = 1; i*CONFIG.canvas.pieceSizePx < canvasWidthPxs; i++){
      let line = document.createElementNS(svgNS, 'line');
      line.setAttribute('x1', i*CONFIG.canvas.pieceSizePx);
      line.setAttribute('x2', i*CONFIG.canvas.pieceSizePx);
      line.setAttribute('y1', 0);
      line.setAttribute('y2', canvasHeightPxs);
      gridGroup.appendChild(line);
    }
    // add horizontal lines
    for(let i = 1; i*CONFIG.canvas.pieceSizePx < canvasHeightPxs; i++){
      let line = document.createElementNS(svgNS, 'line');
      line.setAttribute('x1', 0);
      line.setAttribute('x2', canvasWidthPxs);
      line.setAttribute('y1', i*CONFIG.canvas.pieceSizePx);
      line.setAttribute('y2', i*CONFIG.canvas.pieceSizePx);
      gridGroup.appendChild(line);
    }

    caret.setAttribute('width', CONFIG.canvas.pieceSizePx);
    caret.setAttribute('height', CONFIG.canvas.pieceSizePx);
  }

  function initializePalette(){
    CONFIG.palette.colors.forEach(c => {
      let colorSample = document.createElement('div');
      colorSample.classList.add("sample");
      colorSample.style.backgroundColor = c;
      colorSample.dataset.color = c;
      palette.appendChild(colorSample)
    })

    activeColor = CONFIG.palette.colors[0];
  }

  function onPaletteClick(event){
    if(event.target.dataset.color)
      activeColor = event.target.dataset.color;
  }
  function onCanvasMouseMove(event){
    let caretX = event.offsetX - event.offsetX % CONFIG.canvas.pieceSizePx;
    let caretY = event.offsetY - event.offsetY % CONFIG.canvas.pieceSizePx;

    caret.setAttribute('x', caretX);
    caret.setAttribute('y', caretY);
    caret.setAttribute('fill', activeColor);
  }

  function onCanvasClick(event){
    let bitX = event.offsetX - event.offsetX % CONFIG.canvas.pieceSizePx;
    let bitY = event.offsetY - event.offsetY % CONFIG.canvas.pieceSizePx;
    addBitOnCanvas({x: bitX, y: bitY, color: activeColor});
    sendNewBitMessage({x: bitX, y: bitY, color: activeColor});
  }

  function addBitOnCanvas({x,y, color}){
    let bit = document.createElementNS(svgNS, 'rect');
    bit.setAttribute('x', x);
    bit.setAttribute('y', y);
    bit.setAttribute('fill', 'green');
    bit.setAttribute('width', CONFIG.canvas.pieceSizePx);
    bit.setAttribute('height', CONFIG.canvas.pieceSizePx);
    bit.setAttribute('fill', color);
    drawingGroup.appendChild(bit);
  }

  function sendNewBitMessage(payload){
    socket.send(decodePoint(payload));
  }

  function onNewBitMessageReceived(event) {
    addBitOnCanvas(encodePoint(event.data))
    addReport("Point received")
  };

  function onSocketOpen(){
    addReport("Connection has been established")
  }
  function onSocketClose(){
    addReport("Connection has been terminated")
  }

  function onSocketError(){
    addReport("Connection error")
  }

  function decodePoint({x,y,color}){
    return `${x}~${y}~${color}`
  }

  function encodePoint(p){
    let params = p.split('~');
    return {
      x: params[0],
      y: params[1],
      color: params[2],
    }
  }

  function addReport(text){
    let r = document.createElement('div');
    r.innerHTML = text;
    report.prepend(r);
  }
})()