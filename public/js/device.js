const socket = io.connect('https://192.168.11.141:443/phone');

window.onload = function () {
  Positioning.init((xcomp, ycomp, ishover)=>{
    console.log('updating..');
    socket.emit('update', {x : xcomp, y : ycomp, hover: ishover});
  });
};

$('#calibrateSensor').click(() => {
  console.log('Calibrating...');
  Positioning.calibrate();
});

$('#clearCanvas').click(() => {
  socket.emit('clearCanvas');
});