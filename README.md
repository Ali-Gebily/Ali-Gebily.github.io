## Prerequisites
1. Make sure backend is deployed as described in [Services Repo](https://github.com/topcoderinc/HP-LP-WWF-Detect-IT-Services).
2. Install [Node.js](http://nodejs.org)
 - on OSX use [homebrew](http://brew.sh) `brew install node`
 - on Windows use [chocolatey](https://chocolatey.org/) `choco install nodejs`

3. libsass is needed for the gulp scss plugin to run as it uses the native libsass package as the bundled strategy gives weird bugs

    ```bash
    npm install -g bower gulp nodemon
    ```

    >Refer to: [instructions on how to not require sudo](https://github.com/sindresorhus/guides/blob/master/npm-global-without-sudo.md)

## Installing Dependencies
- run `npm install`
- run `bower install`

## Configuration
Configuration file **config.js** is located under **src/client/app/core/config.js\**. You need to configure following values:

- **REST\_API\_BASE\_URL**: default value is pre-set in gulp.config.js, will be overrided by environment variable **WWFF_REST_API_BASE_URL** if set
- **PERIOD\_YEARS**: Defines the range of years in the search data page. Default value is **[2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015]**
- **SEARCH\_DATA\_MAX\_IMPORTERS\_COUNT**: Defines maximum number of importers in trade data search query. Default value is **5**
- **SEARCH\_DATA\_MAX\_EXPORTERS\_COUNT**: Defines maximum number of exporters in trade data search query. Default value is **5**
- **SEARCH\_DATA\_MAX\_COMMODITIES\_COUNT**: Defines maximum number of commodities in trade data search query. Default value is **5**
- **DASHBOARD\_CASE\_STUDY\_COUNT**: Defines count of latest case studies to display on the right side panel. Default value is **3**
- **CSV\_FILE\_NAMES**: Defines CSV file names for exported files in Dashboard, Alert Details, and Data Comparison pages.
- **contentfulSpace**: default value is pre-set in gulp.config.js, will be overrided by environment variable **WWFF_CONTENTFUL_SPACE** if set
- **contentfulAccessToken**: default value is pre-set in gulp.config.js, will be overrided by environment variable **WWFF_CONTENTFUL_ACCESS_TOKEN** if set
- **COUNTRY\_CODE\_MAPPING**: This is a mapping from Vertica country name to datamaps.js country codes. It is used to colorize countries on a map.

## Environment variable
You can overwrite some configuration by set a environment variable, if the environment variable is unset, then default values (the env property of exports object) in **gulp.config.js** will be used, the envrionment variable will be read during every build. You can overwrite other configuration by add an comment in form of *// replace-env {ENV_NAME}*, string in the braces is the name of environment variable, then configration value under the comment can be overwritten. For now, following environment variable is available.

- **WWFF_REST_API_BASE_URL**: backend restful api base url
- **WWFF_CONTENTFUL_SPACE**: The Contentful space.
- **WWFF_CONTENTFUL_ACCESS_TOKEN**: The Contentful access token.
- **WWFF_APP_VERSION**: version of this app which will be displayed at footer of page, default to null.

## Test Accounts
If you executed `testdata.sql` when deploying the backend, you can use the following users for testing:
- username: admin password: 123
- username: user password: 123

### Running in dev mode
- Run the project with `gulp serve-dev`
- This opens it in a browser and updates the browser with any file changes.

### Running in production mode
- Run `gulp inject` to compile css
- Run `npm start` to start the server

### Tests
- Run the unit tests using `gulp test` (via karma, mocha, sinon).
