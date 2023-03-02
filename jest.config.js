const tsconfig = require('./tsconfig.json');
const paths = tsconfig.compilerOptions.paths;

const moduleNameMapper = Object.keys(paths).reduce((acc, curr) => {
  return {
    ...acc,
    [curr]: '<rootDir>' + paths[curr],
  };
}, {});

module.exports = {
  moduleNameMapper,
};
