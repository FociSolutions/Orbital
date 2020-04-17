// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {

    config.set({
      basePath: '',
      frameworks: ['jasmine', '@angular-devkit/build-angular'],
      plugins: [
        require('karma-jasmine'),
        require('karma-chrome-launcher'),
        require('karma-jasmine-html-reporter'),
        require('karma-coverage-istanbul-reporter'),
        require('@angular-devkit/build-angular/plugins/karma'),
        require('karma-junit-reporter'),
        require('karma-spec-reporter'),
        require('karma-skipped-tests-reporter'),
        require('./karma-no-spec-no-pass')
      ],
      client: {
        clearContext: false, // leave Jasmine Spec Runner output visible in browser
        captureConsole: false
      },
      coverageIstanbulReporter: {
        dir: require('path').join(__dirname, '../coverage'),
        reports: ['html', 'lcovonly', 'text-summary', 'cobertura'],
        fixWebpackSourcePaths: true
      },
      reporters: ['progress', 'kjhtml', 'junit', 'spec', 'skipped-tests', 'no-spec-no-pass'],
      junitReporter: {
        outputDir: '../junit'
      },
      port: 9876,
      colors: true,
      logLevel: config.LOG_INFO,
      autoWatch: false,
      browsers: ['ChromeHeadless'],
      singleRun: true,
      files: [
        {pattern: 'src/assets/**/*.*', included: false, served: true},
      ],
      proxies: {
        '/assets/': '/base/src/assets/'
      }
    });
  };
