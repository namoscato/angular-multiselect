module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      'src/dist/js/vendor.min.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'src/dist/js/app.min.js',
      'tests/**/*.spec.js',
    ],
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['ChromeHeadless'],
    singleRun: false
  })
}
