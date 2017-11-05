const socket = io.connect('https://192.168.8.178:443/phone');

window.onload = function () {
  window.scrollTo(0, 1);
  $('.ui.basic.modal').modal({
    closable: false
  }).modal('show');
  Positioning.init((xcomp, ycomp, ishover) => {
    console.log(Positioning.getReading());
    socket.emit('update', {
      x: xcomp,
      y: ycomp,
      hover: ishover
    });
  });

  $('#calibrateSensor').click(() => {
    $('.ui.basic.modal').modal({
      closable: false
    }).modal('show');
    Positioning.calibrate().then(() => {
      $('.ui.basic.modal').modal('hide');
    });
  });

  $('#clearCanvas').click(() => {
    socket.emit('canvasClear');
  });

  $('.ui.buttons button.color').click(function () {
    socket.emit('changeColor', {
      color: $(this).data('color')
    });
  });

  $('.ui.buttons button.size').click(function () {
    socket.emit('changeBrushWidth', {
      width: $(this).data('width')
    });
  });

};