module.exports = {
  env: {
    browser: true,
    es6: true
  },
  extends: [
    'standard'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parserOptions: { // 使用babel-eslint 做编译器
    parser: 'babel-eslint',
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  rules: {
  }
}
