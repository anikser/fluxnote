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
  function dlCanvas() {
    let dt = canvas.toDataURL('image/png');
    this.href = dt;
  };
  $("#downloadButton")[0].addEventListener('click', dlCanvas, false);

  canvas.add(circle);

  socket.on('update', (data) => {
    draw(data.x, data.y, data.hover);
  });

  socket.on('canvasClear', () => {
    console.log('clearing');
    canvas.clear();
    canvas.add(circle);
  });

  socket.on('changeColor', (data) => {
    brush.color = data.color;
    circle.set("fill", data.color);
  });

  socket.on('changeBrushWidth', (data) => {
    brush.width = data.width;
    circle.set("radius", data.width / 1.5);
  });

  socket.on('undo', undo);

  $("#clearButton").click(() => {
    canvas.clear();
    canvas.add(circle);
  });

  $("#downloadButton").click(() => {
    console.log("download");
  });

};

function undo() {
  let len = canvas.getObjects().length;
  if (len == 0) return;
  let item = canvas.item(len - 1);
  if(item.get("type") === "path") {
    canvas.remove(item);
  } else {
    if (len < 2) return;
    item = canvas.item(len - 2);
    canvas.remove(item);
  }
  canvas.renderAll();
}

function draw(x, y, hover) {
  let location = {
    x: window.innerWidth / 2 + x * 1560,
    y: y * 1560 - 100
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