/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  // preset: 'ts-jest/presets/default-esm',
  testEnvironment: "node",
  verbose: true,
  moduleNameMapper: {
    '^@auth/core(.*)$': ['<rootDir>/node_modules/@auth/core/$1'],
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  // transform: {},
  // extensionsToTreatAsEsm: ['.ts'],
  // moduleFileExtensions: ["js", "jsx", "ts", "tsx"],
  // moduleDirectories: ["node_modules", "src"],
  transform: {
    // '^src/index\\.ts$': 'ts-jest': {
    //     useESM: true,
    //     tsconfig: './tsconfig.json'
    //   },
    '^.+\\.ts$': 'ts-jest',
  },
  // moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  // transformIgnorePatterns: [],
  // transformIgnorePatterns: [`/node_modules/(?!(${['@auth/core'].join('|')})/)`],

  // transformIgnorePatterns: ["[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$"],
  // moduleFileExtensions: ["mjs", "cjs", "ts", "tsx", "js", "jsx", "json", "node"],
  // moduleDirectories: ["node_modules", "src"],

  // globals: {
  //   'ts-jest': {
  //     useESM: true,
  //     tsconfig: './tsconfig.json'
  //   },
  // },

}
