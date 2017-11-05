const Positioning = (function () {
  
  const CALIBRATE_SECONDS = 5;
  const MAX_MAGNITUDE = 17;
  const MIN_MAGNITUDE = 10;
  const LIFT_THRESHOLD = 0.72;

  let module = {};
  let sensor;
  let backgroundField = {};

  module.init = (callback) => {
    console.log('Initializing positioning service...');
    sensor = new Magnetometer({
      frequency: 10
    });
    sensor.start();
    sensor.onerror = event => console.log(event.error.name, event.error.message);
    module.calibrate(null).then(() => {
      read(callback);
    });
  };

  function read(callback) {
    sensor.onreading = () => {
      let distance = getDistance();
      let reading = module.getReading();
      let angle = Math.atan2(reading.y, reading.x) / 1.5;
      let xcomp = 0, ycomp = 0, hover = false;
      if (distance > 0) {
        xcomp = distance * Math.sin(angle);
        ycomp = distance * Math.cos(angle);
        if (Math.abs(reading.z*(distance**2)) > LIFT_THRESHOLD) {
         hover = true;
        }
      }
      //console.log(reading.z*(distance**2));
      callback(xcomp, ycomp, hover);
    };
  }

  module.calibrate = () => {
    var promise = new Promise(function (resolve, reject) {
      if (!sensor) {
        console.error("No sensor object");
        reject();
      }
      let sumField = {
        x: 0.0,
        y: 0.0,
        z: 0.0
      }
      let r = 0;
      sensor.onreading = () => {
        r++;
        for (axis in sumField) {
          sumField[axis] += sensor[axis];
        }
      };
      setTimeout(() => {
        //sensor.onreading = null;
        for (axis in sumField) {
          backgroundField[axis] = sumField[axis] / r;
        }
        console.log("Calibrated!");
        resolve();
      }, CALIBRATE_SECONDS * 1000);
    });
    return promise;
  }

  function getCalibratedReading(x, y, z) {
    return {
      x: x - backgroundField.x,
      y: y - backgroundField.y,
      z: z - backgroundField.z
    };
  }

  module.getReading = () => {
    return getCalibratedReading(sensor.x, sensor.y, sensor.z);
  }

  function getMagnitude(){
    let reading = getCalibratedReading(sensor.x, sensor.y, sensor.z);
    let mag = Math.pow(reading.x ** 2 + reading.y ** 2 + reading.z ** 2, 1 / 2);
    return (mag - MIN_MAGNITUDE < 0) ? 0 : mag;
  }

  function getDistance() {
    let mag = getMagnitude();
    if (mag == 0) return 0;
    return 1/Math.pow(mag, 1/3);
  }

  return module;

}());