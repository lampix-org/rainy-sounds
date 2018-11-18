const path = require('path');
const fs = require('fs');

const optionalFilesCopyRules = (filenames, {
  root,
  outputPath
} = {
  root: process.cwd(),
  outputPath: ''
}) => {
  const rules = [];

  filenames.forEach((filename) => {
    if (fs.existsSync(filename)) {
      rules.push({ from: path.join(root, filename), to: outputPath });
    }
  });

  return rules;
};

exports.optionalFilesCopyRules = optionalFilesCopyRules;
