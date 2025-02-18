exports.config = function () {
  //console.log(process.env.NODE_ENV, 'Environment AQUÍ');
  var envJSON = require('./config-env-variables.json');
  var node_env = process.env.NODE_ENV || 'development';
  
  return envJSON[node_env];
}