const socket = io.connect('https://192.168.11.141:443/phone');

window.onload = function () {
  Positioning.init((xcomp, ycomp, ishover)=>{
    console.log('updating..');
    socket.emit('update', {x : xcomp, y : ycomp, hover: ishover});
  });
};

$('#calibrateSensor').click(() => {
  $('.ui.basic.modal').modal({closable: false}).modal('show');
  Positioning.calibrate().then(() => {
    $('.ui.basic.modal').modal('hide');
  });
});

$('#clearCanvas').click(() => {
  socket.emit('clearCanvas');
});

$('button.color').click(() => {
  socket.emit('changeColor', {color: $(this).data('color')});
});