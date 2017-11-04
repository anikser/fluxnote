window.onload = function(){
  let sensor = new window.Magnetometer();
  
  sensor.start();
  
  sensor.onreading = () => {
      console.log("Magnetic field along the X-axis " + sensor.x);
      console.log("Magnetic field along the Y-axis " + sensor.y);
      console.log("Magnetic field along the Z-axis " + sensor.z);
  };
  
  sensor.onerror = event => console.log(event.error.name, event.error.message);
};
