(function(){
  const CONFIG = {
    canvas:{
      pieceSizePx: 30,
      widthPieces: 20,
      heightPieces: 10
    }
  }

  const canvas = document.getElementById('canvas');
  const svgNS = "http://www.w3.org/2000/svg";  


  initializeCanvas();

  function initializeCanvas(){
    let canvasWidthPxs = CONFIG.canvas.widthPieces * CONFIG.canvas.pieceSizePx;
    let canvasHeightPxs = CONFIG.canvas.heightPieces * CONFIG.canvas.pieceSizePx;
    canvas.setAttribute('width',  canvasWidthPxs);
    canvas.setAttribute('height', canvasHeightPxs);

    let gridGroup = document.createElementNS(svgNS, 'g');
    gridGroup.classList.add('grid');
    let drawingGroup = document.createElementNS(svgNS, 'g');
    drawingGroup.classList.add('drawing');
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
    canvas.appendChild(drawingGroup);
    canvas.appendChild(gridGroup);
  }

  var socket = new WebSocket("ws://localhost:8081");
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