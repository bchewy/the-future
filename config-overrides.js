module.exports = function override(config, env) {
  // Add fallbacks for node modules
  config.resolve.fallback = {
    ...config.resolve.fallback,
    fs: false,
    path: false,
    crypto: false,
    os: false,
    net: false,
    tls: false,
    child_process: false,
    stream: false,
    http: false,
    https: false,
    zlib: false
  };

  return config;
}; 