let drawing = false
var mouseLocation = {}

var canvas = new fabric.Canvas('canvas');
var brush = new fabric.PencilBrush(canvas)

canvas.on('mouse:move', function(options) {
    mouseLocation = {x: options.e.layerX, y: options.e.layerY}
    if (drawing) {
        brush.onMouseMove(mouseLocation)
    }
});

window.onkeypress = function(e) {
    if (e.key == 'd' && !drawing) {
        drawing = true;
        brush.onMouseDown(mouseLocation)
    }
}

window.onkeyup = function(e) {
    if (e.key == 'd') {
        drawing = false
        brush.onMouseUp(mouseLocation)
    }
}
