const setInitialConditions = (ref, error, c, m, q) => {
    c[0] = 0;
    error[0] = ref[0] - c[0];
    m[0] = 0;
    c[1] = c[0];
    error[1] = ref[1] - c[1];
    m[1] = 400 * (0.0025*q*m[0] + (1-q)*error[0])
    c[2] = c[1];
    error[2] = ref[2] - c[2];
    m[2] = 400 * (0.0025*q*m[1] + (1-q)*error[1] - (1-q)*error[0])
    c[3] = c[2];
    error[3] = ref[3] - c[3];
    m[3] = 400 * (0.0025*q*m[2] + (1-q)*error[2] - (1-q)*error[1])
    c[4] = c[3];
    error[4] = ref[4] - c[4];
    m[4] = 400 * (0.0025*q*m[3] + (1-q)*error[3] - (1-q)*error[2])
    c[5] = c[4] + 0.0025 * m[0];
    error[5] = ref[5] - c[5];
    m[5] = 400 * (0.0025*q*m[4] + (1-q)*error[4] - (1-q)*error[3])
  };
  
  module.exports = (reference, iterations, tau, samplingTime) => {
    let ref = new Array(iterations).fill(reference);
    let error = new Array(iterations);
    let c = new Array(iterations);
    let m = new Array(iterations);
    const q = Math.exp(-samplingTime/tau);
    setInitialConditions(ref, error, c, m, q);
    for (let k = 6; k < iterations; k++) {
      c[k] = c[k - 1] + 0.0025 * m[k - 5];
      error[k] = ref[k] - c[k];
      m[k] = 400 * (0.0025*q*m[k-1] + 0.0025*(1-q)*m[k-6] + (1-q)*error[k-1] - (1-q)*error[k-2]);
    }
    return { reference: ref, error: error, c: c, m: m };
  };
  