const setInitialConditions = (ref, error, c, m, kp, ki, kd, samplingTime) => {
  c[0] = 0;
  error[0] = ref[0] - c[0];
  m[0] =
    (1 / (2 * samplingTime)) *
    (2 * samplingTime * kp + ki * Math.pow(samplingTime, 2) + 4 * kd) *
    error[0];
  c[1] = c[0];
  error[1] = ref[1] - c[1];
  m[1] =
    (1 / (2 * samplingTime)) *
    ((2 * samplingTime * kp + ki * Math.pow(samplingTime, 2) + 4 * kd) *
      error[1] +
      (2 * ki * Math.pow(samplingTime, 2) - 8 * kd) * error[0]);
  c[2] = c[1];
  error[2] = ref[2] - c[2];
  m[2] =
    (1 / (2 * samplingTime)) *
    (2 * samplingTime * m[0] +
      (2 * samplingTime * kp + ki * Math.pow(samplingTime, 2) + 4 * kd) *
        error[2] +
      (2 * ki * Math.pow(samplingTime, 2) - 8 * kd) * error[1] +
      (ki * Math.pow(samplingTime, 2) - 2 * samplingTime * kp + 4 * kd) *
        error[0]);
  c[3] = c[2];
  error[3] = ref[3] - c[3];
  m[3] =
    (1 / (2 * samplingTime)) *
    (2 * samplingTime * m[1] +
      (2 * samplingTime * kp + ki * Math.pow(samplingTime, 2) + 4 * kd) *
        error[3] +
      (2 * ki * Math.pow(samplingTime, 2) - 8 * kd) * error[2] +
      (ki * Math.pow(samplingTime, 2) - 2 * samplingTime * kp + 4 * kd) *
        error[1]);
  c[4] = c[3];
  error[4] = ref[4] - c[4];
  m[4] =
    (1 / (2 * samplingTime)) *
    (2 * samplingTime * m[2] +
      (2 * samplingTime * kp + ki * Math.pow(samplingTime, 2) + 4 * kd) *
        error[4] +
      (2 * ki * Math.pow(samplingTime, 2) - 8 * kd) * error[3] +
      (ki * Math.pow(samplingTime, 2) - 2 * samplingTime * kp + 4 * kd) *
        error[2]);
  c[5] = c[4] + 0.0025 * m[0];
  error[5] = ref[5] - c[5];
  m[5] =
    (1 / (2 * samplingTime)) *
    (2 * samplingTime * m[3] +
      (2 * samplingTime * kp + ki * Math.pow(samplingTime, 2) + 4 * kd) *
        error[5] +
      (2 * ki * Math.pow(samplingTime, 2) - 8 * kd) * error[4] +
      (ki * Math.pow(samplingTime, 2) - 2 * samplingTime * kp + 4 * kd) *
        error[3]);
};

module.exports = (reference, iterations, kp, ki, kd, samplingTime) => {
  let ref = new Array(iterations).fill(reference);
  let error = new Array(iterations);
  let c = new Array(iterations);
  let m = new Array(iterations);
  setInitialConditions(ref, error, c, m, kp, ki, kd, samplingTime);
  for (let k = 6; k < iterations; k++) {
    c[k] = c[k - 1] + 0.0025 * m[k - 5];
    error[k] = ref[k] - c[k];
    m[k] =
      (1 / (2 * samplingTime)) *
      (2 * samplingTime * m[k - 2] +
        (2 * samplingTime * kp + ki * Math.pow(samplingTime, 2) + 4 * kd) *
          error[k] +
        (2 * ki * Math.pow(samplingTime, 2) - 8 * kd) * error[k - 1] +
        (ki * Math.pow(samplingTime, 2) - 2 * samplingTime * kp + 4 * kd) *
          error[k - 2]);
  }
  return { reference: ref, error: error, c: c, m: m };
};
