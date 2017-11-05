const canvas = new fabric.Canvas('canvas');
const brush = new fabric.PencilBrush(canvas);
const socket = io.connect('https://localhost:443/desktop');

let drawing = false;

let circle = new fabric.Circle({
  radius: 4,
  fill: 'black',
  left: -100,
  top: -100
});

window.onload = function () {
  canvas.setWidth(window.innerWidth);
  canvas.setHeight(window.innerHeight);

  canvas.add(circle);

  socket.on('update', (data) => {
    draw(data.x, data.y, data.hover);
  });

  socket.on('canvasClear', () => {
    console.log('clearing');
    canvas.clear();
  });

  socket.on('changeColor', (data) => {
    brush.color = data.color;
    circle.set("fill", data.color);
  });

  socket.on('changeBrushWidth', (data) => {
    brush.width = data.width;
    circle.set("radius", data.width / 1.5);
  });

};

function draw(x, y, hover) {
  let location = {
    x: window.innerWidth / 2 + x * 1200,
    y: y * 1100 - 140
  };
  if ((x == 0 && y == 0) || hover) {
    if (drawing) {
      drawing = false;
      brush.onMouseUp(location);
    }
    if (hover) {
      circle.set({
        top: location.y,
        left: location.x
      });
    } else {
      circle.set({
        top: -100,
        left: -100
      });
    }
  } else {
    if (!drawing) {
      brush.onMouseDown(location);
      drawing = true;
    }
    brush.onMouseMove(location);
    circle.set({
      top: -100,
      left: -100
    });
  }
  canvas.renderAll();
}