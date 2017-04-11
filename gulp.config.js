module.exports = function() {
  var client = './src/client/';
  var server = './src/server/';
  var clientApp = client + 'app/';
  var report = './report/';
  var root = './';
  var specRunnerFile = 'specs.html';
  var temp = './.tmp/';
  var wiredep = require('wiredep');
  var bowerFiles = wiredep({ devDependencies: true })['js'];
  var bower = {
    json: require('./bower.json'),
    directory: './bower_components/',
    ignorePath: '../..'
  };
  var nodeModules = 'node_modules';

  var config = {
    /**
     * File paths
     */
    // all javascript that we want to vet
    alljs: [
      './src/**/*.js',
      './*.js',
      '!./src/**/*.directive.js',
      '!./src/client/app/jquery_legacy/legacy.js'
    ],
    build: './build/',
    client: client,
    clientConfig: client + 'app/core/config.js',
    clientConfigDir: client + 'app/core/',
    css: temp + 'styles.css',
    fonts: bower.directory + 'font-awesome/fonts/**/*.*',
    html: client + '**/*.html',
    htmltemplates: clientApp + '**/*.html',
    images: client + 'images/**/*.*',
    index: client + 'index.html',
    footer: client + 'app/layout/footer.html',
    footerDir: client + 'app/layout/',
    // app js, with no specs
    js: [
      clientApp + '**/*.module.js',
      clientApp + '**/*.js',
      '!' + clientApp + '**/*.spec.js'
    ],
    jsOrder: [
      '**/app.module.js',
      '**/*.module.js',
      '**/*.js'
    ],
    less: client + 'styles/styles.less',
    scss: client + 'styles/styles.scss',
    report: report,
    root: root,
    server: server,
    source: 'src/',
    stubsjs: [
      bower.directory + 'angular-mocks/angular-mocks.js',
      client + 'stubs/**/*.js'
    ],
    temp: temp,

    /**
     * optimized files
     */
    optimized: {
      app: 'app.js',
      lib: 'lib.js'
    },

    /**
     * plato
     */
    plato: { js: clientApp + '**/*.js' },

    /**
     * browser sync
     */
    browserReloadDelay: 1000,

    /**
     * template cache
     */
    templateCache: {
      file: 'templates.js',
      options: {
        module: 'app.core',
        root: 'app/',
        standalone: false
      }
    },

    /**
     * Bower and NPM files
     */
    bower: bower,
    packages: [
      './package.json',
      './bower.json'
    ],

    /**
     * specs.html, our HTML spec runner
     */
    specRunner: client + specRunnerFile,
    specRunnerFile: specRunnerFile,

    /**
     * The sequence of the injections into specs.html:
     *  1 testlibraries
     *      mocha setup
     *  2 bower
     *  3 js
     *  4 spechelpers
     *  5 specs
     *  6 templates
     */
    testlibraries: [
      nodeModules + '/mocha/mocha.js',
      nodeModules + '/chai/chai.js',
      nodeModules + '/sinon-chai/lib/sinon-chai.js'
    ],
    specHelpers: [client + 'test-helpers/*.js'],
    specs: [clientApp + '**/*.spec.js'],
    serverIntegrationSpecs: [client + '/tests/server-integration/**/*.spec.js'],

    /**
     * Node settings
     */
    nodeServer: server + 'app.js',
    defaultPort: '8001',

    /**
    * Default environment variable
    */
    env:{
      'WWFF_REST_API_BASE_URL': 'http://localhost:50630',
      'WWFF_CONTENTFUL_SPACE': '9i1m79rt44ru',
      'WWFF_CONTENTFUL_ACCESS_TOKEN': 'd6b16c2a8821ab46dd0038fa3809923c7c3cfc52b882ea0fd61363912d19e995',
      'WWFF_APP_VERSION': null
    }
  };

  /**
   * wiredep and bower settings
   */
  config.getWiredepDefaultOptions = function() {
    var options = {
      bowerJson: config.bower.json,
      directory: config.bower.directory,
      ignorePath: config.bower.ignorePath
    };
    return options;
  };

  /**
   * karma settings
   */
  config.karma = getKarmaOptions();

  return config;

  ////////////////

  function getKarmaOptions() {
    var options = {
      files: [].concat(
        bowerFiles,
        config.specHelpers,
        clientApp + '**/*.module.js',
        clientApp + '**/*.js',
        temp + config.templateCache.file,
        config.serverIntegrationSpecs
      ),
      exclude: [],
      coverage: {
        dir: report + 'coverage',
        reporters: [
          // reporters not supporting the `file` property
          { type: 'html', subdir: 'report-html' },
          { type: 'lcov', subdir: 'report-lcov' },
          { type: 'text-summary' } //, subdir: '.', file: 'text-summary.txt'}
        ]
      },
      preprocessors: {}
    };
    options.preprocessors[clientApp + '**/!(*.spec)+(.js)'] = ['coverage'];
    return options;
  }
};
