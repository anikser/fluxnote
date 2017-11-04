let drawing = false;

var canvas = new fabric.Canvas('canvas');
var brush = new fabric.PencilBrush(canvas)

window.onload = function () {
  Positioning.init(draw);
  canvas.setWidth(300);
  canvas.setHeight(200);
};

function draw(x, y) {
  let location = {x: 150+x * 400, y: y * 400};
  console.log(location);
  if (x == 0 && y == 0) {
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