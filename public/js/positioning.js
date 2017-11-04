const Positioning = (function () {

  const CALIBRATE_SECONDS = 10;

  let module = {};
  let sensor;
  let backgroundField = {};

  module.init = () => {
    sensor = new Magnetometer({frequency: 10});
    sensor.start();
    
  };

  module.kek = () => {
    module.calibrate().then(read);
  };

  function read() {
    sensor.start();
    sensor.onreading = () => {
      //console.log(backgroundField);
      console.log(getCalibratedReading(sensor.x, sensor.y, sensor.z));
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
        console.log("succ");
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

  return module;

}());