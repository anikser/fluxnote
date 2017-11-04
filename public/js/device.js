const socket = io.connect('https://192.168.11.141');

window.onload = function () {
  Positioning.init((xcomp, ycomp)=>{
    socket.emit('update', {x : xcomp, y : ycomp});
  });
};

$('#drawToggle').on('click', ()=>{
  
  if($('#drawToggle').hasClass('enable')){
    socket.emit('drawOn');
    $('#drawToggle').removeClass('enable');
  }else{
    socket.emit('drawOff');
    $('#drawToggle').addClass('disable');
  }

  //togglebutton
});