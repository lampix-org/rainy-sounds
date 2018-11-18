const fs = require('fs');

const { joinToDist } = require('./joinToUtils');

const optionalFilesCopyRules = (pathsToCheck, outputPath) => {
  const rules = [];
  const output = outputPath != null ? outputPath : joinToDist();

  pathsToCheck.forEach((pathToCheck) => {
    if (fs.existsSync(pathToCheck)) {
      rules.push({ from: pathToCheck, to: output });
    }
  });

  return rules;
};

exports.optionalFilesCopyRules = optionalFilesCopyRules;
