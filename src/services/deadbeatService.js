const setInitialConditions = (ref, error, c, m) => {
  c[0] = 0;
  error[0] = ref[0] - c[0];
  m[0] = 0;
  c[1] = c[0];
  error[1] = ref[1] - c[1];
  m[1] = 400 * error[0];
  c[2] = c[1];
  error[2] = ref[2] - c[2];
  m[2] = 400 * (error[1] - error[0]);
  c[3] = c[2];
  error[3] = ref[3] - c[3];
  m[3] = 400 * (error[2] - error[1]);
  c[4] = c[3];
  error[4] = ref[4] - c[4];
  m[4] = 400 * (error[3] - error[2]);
  c[5] = c[4] + 0.0025 * m[0];
  error[5] = ref[5] - c[5];
  m[5] = 400 * (error[4] - error[3]);
};

module.exports = (reference, iterations) => {
  let ref = new Array(iterations).fill(reference);
  let error = new Array(iterations);
  let c = new Array(iterations);
  let m = new Array(iterations);
  setInitialConditions(ref, error, c, m);
  for (let k = 6; k < iterations; k++) {
    c[k] = c[k - 1] + 0.0025 * m[k - 5];
    error[k] = ref[k] - c[k];
    m[k] = 400 * (0.0025 * m[k - 6] + error[k - 1] - error[k - 2]);
  }
  return { reference: ref, error: error, c: c, m: m };
};
