const canvas = new fabric.Canvas('canvas');
const brush = new fabric.PencilBrush(canvas);
const socket = io.connect('https://localhost:443/desktop');

let drawing = false;

window.onload = function () {
  canvas.setWidth(window.innerWidth);
  canvas.setHeight(window.innerHeight);
  
  socket.on('update', (data)=>{
    draw(data.x, data.y, data.hover);
  });
  
  socket.on('canvasClear', () =>{
    console.log('clearing');
    canvas.clear();
  });

  socket.on('changeColor', (data) => {
    brush.color = data.color;
  });

  socket.on('changeBrushWidth', (data) => {
    brush.width = data.width;
  });

};



function draw(x, y, hover) {
  let location = {x: 150+x * 400, y: y * 400};
  console.log(location);
  if ((x == 0 && y == 0) || hover) {
    if (drawing) {
      drawing = false;
      brush.onMouseUp(location);
    }
  } else {
    if (!drawing) {
      brush.onMouseDown(location);
      drawing = true;
    } else {
      brush.onMouseMove(location)
    }
  }
}