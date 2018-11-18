const path = require('path');

const cwd = process.cwd();

exports.joinToCwd = path.join.bind(null, cwd);
exports.joinToDist = path.join.bind(null, cwd, 'dist');
