(function(){
  const CONFIG = {
    canvas:{
      pieceSizePx: 30,
      widthPieces: 20,
      heightPieces: 10
    }
  }

  const canvas = document.getElementById('canvas');
  const drawingGroup = canvas.getElementsByClassName('drawing')[0];
  const gridGroup = canvas.getElementsByClassName('grid')[0];
  const caret = drawingGroup.getElementsByClassName('caret')[0];
  const svgNS = "http://www.w3.org/2000/svg";  
  const socket = new WebSocket("ws://localhost:8081");

  initializeCanvas();

  canvas.addEventListener('mousemove', onCanvasMouseMove);
  canvas.addEventListener('click', onCanvasClick)

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

  function onCanvasMouseMove(event){
    let caretX = event.offsetX - event.offsetX % CONFIG.canvas.pieceSizePx;
    let caretY = event.offsetY - event.offsetY % CONFIG.canvas.pieceSizePx;

    caret.setAttribute('x', caretX);
    caret.setAttribute('y', caretY);
  }

  function onCanvasClick(event){
    let bitX = event.offsetX - event.offsetX % CONFIG.canvas.pieceSizePx;
    let bitY = event.offsetY - event.offsetY % CONFIG.canvas.pieceSizePx;
    addBitOnCanvas({x: bitX, y: bitY});
    sendNewBitMessage({x: bitX, y: bitY});
  }

  function addBitOnCanvas({x,y}){
    let bit = document.createElementNS(svgNS, 'rect');
    bit.setAttribute('x', x);
    bit.setAttribute('y', y);
    bit.setAttribute('fill', 'green');
    bit.setAttribute('width', CONFIG.canvas.pieceSizePx);
    bit.setAttribute('height', CONFIG.canvas.pieceSizePx);
    drawingGroup.appendChild(bit);
  }

  function sendNewBitMessage(payload){
    socket.send(JSON.stringify(payload));
  }
  //var socket = new WebSocket("ws://localhost:8081");
  /*
  // отправить сообщение из формы publish
  document.forms.publish.onsubmit = function() {
    var outgoingMessage = this.message.value;
  
    socket.send(outgoingMessage);
    return false;
  };
  
  // обработчик входящих сообщений
  socket.onmessage = function(event) {
    var incomingMessage = event.data;
    showMessage(incomingMessage);
  };
  
  // показать сообщение в div#subscribe
  function showMessage(message) {
    var messageElem = document.createElement('div');
    messageElem.appendChild(document.createTextNode(message));
    document.getElementById('subscribe').appendChild(messageElem);
  }*/
})()