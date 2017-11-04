const Positioning = (function () {

  const CALIBRATE_SECONDS = 5;
  const MAX_MAGNITUDE = 10;
  const MIN_MAGNITUDE = 1.6;

  let module = {};
  let sensor;
  let backgroundField = {};

  module.init = (callback) => {
    sensor = new Magnetometer({
      frequency: 10
    });
    sensor.start();
    sensor.onerror = event => console.log(event.error.name, event.error.message);
    module.calibrate().then(() => {
      read(callback)
    });
  };

  function read() {
    sensor.start();
    sensor.onreading = () => {
      let magnitude = module.getMagnitude();
      let reading = module.getReading();
      let angle = Math.atan2(reading.y, reading.x) / 2;
      let xcomp = (MAX_MAGNITUDE - magnitude) * Math.sin(angle);
      let ycomp = (MAX_MAGNITUDE - magnitude) * Math.cos(angle);
      console.log(magnitude, angle, xcomp, ycomp);
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
        sensor.onreading = null;
        for (axis in sumField) {
          backgroundField[axis] = sumField[axis] / r;
        }
        console.log("Calibrated!");
        sensor.stop();
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
  module.getMagnitude = () => {
    let reading = getCalibratedReading(sensor.x, sensor.y, sensor.z);
    let mag = Math.pow(reading.x ** 2 + reading.y ** 2 + reading.z ** 2, 1 / 6);
    return (mag - MIN_MAGNITUDE < 0) ? 0 : mag;
  }

  return module;

}());