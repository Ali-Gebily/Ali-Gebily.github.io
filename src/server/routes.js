var router = require('express').Router();
var four0four = require('./utils/404')();
var data = require('./data');
var _ = require('lodash');
var moment = require('moment');

router.get('/forumthreads', forumThreads);
router.get('/hottopics', hotTopics);
router.get('/latestposts', latestPosts);
router.get('/postcomments', postComments);
router.get('/person/:id', getPerson);
router.post('/users/auth', findUser);
router.get('/linedata', lineData);
router.get('/monthlylinedata', monthlyLineData);
router.get('/yearlineData', yearLineData);
router.post('/users/register', registerUser);
router.get('/notifications', notifications);
router.get('/notificationsclass', notificationsClass);
router.get('/newcasestudies', newCaseStudies);
router.get('/findalert', findAlert);
router.get('/alertcomments/:alertid', alertComments);
router.get('/datacomparison', datacomparison);
router.get('/myquerylist', myQueryList);
router.get('/*', four0four.notFoundMiddleware);

module.exports = router;

//////////////

function forumThreads(req, res, next) {
  var forumThreads = require('../client/data/forumThreads.json');

  res.status(200).json(forumThreads);
}

function hotTopics(req, res, next) {
  var hotTopics = require('../client/data/hotTopics.json');

  res.status(200).json(hotTopics);
}

function latestPosts(req, res, next) {
  var latestPosts = require('../client/data/latestPosts.json');

  res.status(200).json(latestPosts);
}

function postComments(req, res, next) {
  var postComments = require('../client/data/postComments.json');

  res.status(200).json(postComments);
}

function getPerson(req, res, next) {
  var id = +req.params.id;
  var person = data.people.filter(function (p) {
    return p.id === id;
  })[0];

  if (person) {
    res.status(200).send(person);
  } else {
    four0four.send404(req, res, 'person ' + id + ' not found');
  }
}

function findUser(req, res, next) {
  var user = data.getUser(req.body.usrname, req.body.pswd);

  if (user) {
    user.password = '';
  }

  res.status(200).json({usr: user});
}

function registerUser(req, res, next) {
  res.status(200).json({});
}

function lineData(req, res, next) {
  var lineInfo = require('./database/lineData.json');

  res.status(200).json(lineInfo);
}

function monthlyLineData(req, res, next) {
  var lineInfo = require('../client/data/monthlyLineData.json');

  res.status(200).json(lineInfo);
}

function yearLineData(req, res, next) {
  var lineInfo = require('../client/data/yearLineData.json');

  res.status(200).json(lineInfo);
}

function notifications(req, res, next) {

  var lineInfo = require('../client/data/dashboardNotification.json');
  var vals = [];
  if (lineInfo) {
    for (var i = 0; i < lineInfo.length; i++) {
      var entry = lineInfo[i];

      if (matchesQuery(req.query.query, entry)) {
        vals.push(entry);
      }
    }
  }

  res.status(200).json(vals);
}

function notificationsClass(req, res, next) {

  var lineInfo = require('../client/data/dashboardNotification.json');
  var vals = [];
  var notifClass = req.query.notifClass;
  if (notifClass && notifClass.toLowerCase() !== 'All Notifications'.toLowerCase() && lineInfo) {
    for (var i = 0; i < lineInfo.length; i++) {
      var entry = lineInfo[i];

      if (notifClass.toLowerCase() === entry.classType.toLowerCase()) {
        vals.push(entry);
      }
    }
  } else {
    vals = lineInfo || [];
  }

  res.status(200).json(vals);
}

function newCaseStudies(req, res, next) {

  var lineInfo = require('../client/data/dashboardNewCaseStudies.json');

  var vals = [];
  if (lineInfo) {
    for (var i = 0; i < lineInfo.length; i++) {
      var entry = lineInfo[i];

      if (matchesQuery(req.query.query, entry)) {
        vals.push(entry);
      }
    }
  }

  res.status(200).json(vals);
}

function myQueryList(req, res, next) {
  var data = require('../client/data/queryListMyQuerty.json');

  var requestQuery = req.query.query;
  var queryObj = requestQuery ? JSON.parse(requestQuery) : {};

  var resultSet = filteredMyQueryList(queryObj, data);
  res.status(200).json(resultSet);
}

function filteredMyQueryList(queryObj, data) {
  var resultSet = _.filter(data, function (item) {
    var createDate = queryObj.fromDate ? moment(queryObj.fromDate, 'MM/DD/YYYY') : null;
    var updateDate = queryObj.toDate ? moment(queryObj.toDate, 'MM/DD/YYYY') : null;
    var creator = queryObj.creator ? queryObj.creator : null;
    var creationDate = moment(item.creationDate, 'MM/DD/YYYY');
    var lastUpdateDate = moment(item.updateDate, 'MM/DD/YYYY');

    return (!createDate || creationDate.isSame(createDate) &&
      (!updateDate || lastUpdateDate.isSame(updateDate))) &&
      (!creator || item.createdBy.toLowerCase().indexOf(creator.toLowerCase()) !== -1);
  });

  resultSet = resultSet || [];
  return resultSet;
}

function findAlert(req, res, next) {

  var alertData = require('../client/data/alerts.json');

  var vals = [];
  if (alertData) {
    for (var i = 0; i < alertData.length; i++) {
      var entry = alertData[i];

      if (matchesAlertEntry(req.query.searchquery, entry)) {
        vals.push(entry);
      }
    }
  }

  res.status(200).json(vals);
}
function datacomparison(req, res, next) {
  var data = require('../client/data/exportImportReports.json');
  var discrepancy = require('../client/data/discrepancy.json');
  var query = JSON.parse(req.query.query);

  var result = [];
  var fromYear = query.fromYear || 2014;
  var toYear = query.toYear || 2016;
  var reporterCountries = query.reporter &&
  query.reporter.length ? query.reporter : ['United States'];

  var partnerCountries = query.partner && query.partner.length ?
    query.partner : ['Japan'];

  reporterCountries = _.map(reporterCountries, function (val) {
    return val.replace(' ', '_');
  });
  partnerCountries = _.map(partnerCountries, function (val) {
    return val.replace(' ', '_');
  });

  for (var i = fromYear; i <= toYear; i++) {
    var lineItem = {
      year: i, reporterValues: {volume: 0, value: 0},
      partnerValues: {volume: 0, value: 0}, discrepency: null
    };

    _.forEach(reporterCountries, function (ins) {
      var countryInfo = data[ins];
      var yearVal = countryInfo['year'.concat(i)];
      lineItem.reporterValues.volume += yearVal.volume;
      lineItem.reporterValues.value += yearVal.value;
    });

    _.forEach(partnerCountries, function (ins) {
      var countryInfo = data[ins];
      var yearVal = countryInfo['year'.concat(i)];
      lineItem.partnerValues.volume += yearVal.volume;
      lineItem.partnerValues.value += yearVal.value;
    });

    lineItem.discrepency = discrepancy['year'.concat(i)];

    result.push(lineItem);
  }

  res.status(200).json(result);
}

function alertComments(req, res, next) {
  var comments = require('../client/data/alertComments.json');

  var vals = [];
  if (comments) {
    for (var i = 0; i < comments.length; i++) {
      var entry = comments[i];

      if (parseInt(req.params.alertid) === entry.alertId) {
        vals = entry.comments;
        break;
      }
    }
  }

  res.status(200).json(vals);
}

function matchesAlertEntry(query, entry) {
  var matched = true;

  if (query) {

    query = JSON.parse(query);

    if (alertCountriesNotEqual(entry, query)) {
      matched = false;
    }

    if (areStringsNotEqual(entry.commodityName, query.commodityProduct)) {
      matched = false;
    }

    if (areStringsNotEqual(entry.alertType, query.alertType)) {
      matched = false;
    }

    if (isNotNullOrEmptyString(query.tradeValue) && parseInt(query.tradeValue) < entry.tradeValue) {
      matched = false;
    }

    if (alertWeightDifferencesNotInRange(entry, query)) {
      matched = false;
    }
  }

  return matched;
}

function matchesQuery(query, entry) {

  if (!query) {
    return true;
  }

  query = JSON.parse(query);

  if (query.species && query.species.length > 0 && entry.species !== query.species) {
    return false;
  }

  if (query.tradeFlow && query.tradeFlow.length > 0 && entry.tradeFlow !== query.tradeFlow) {
    return false;
  }

  if (query.reportingCountry && query.reportingCountry.length > 0 &&
    entry.reportingCountry !== query.reportingCountry) {
    return false;
  }

  if (query.partCountry && query.partCountry.length > 0 &&
    entry.partCountry !== query.partCountry) {
    return false;
  }

  if (query.periods && query.periods.length > 0 && entry.periods !== query.periods) {
    return false;
  }

  return true;
}

function alertCountriesNotEqual(persistentIns, queryInstance) {
  return areStringsNotEqual(persistentIns.reporterCountryName, queryInstance.reporter) ||
    areStringsNotEqual(persistentIns.partnerCountryName, queryInstance.partner);
}

function alertWeightDifferencesNotInRange(persistentIns, queryInstance) {
  if (isNotNullOrEmptyString(queryInstance.netWeightDifference) &&
    parseInt(queryInstance.netWeightDifference) < persistentIns.netWeightDifference) {
    return true;
  }

  if (isNotNullOrEmptyString(queryInstance.importExportWeightDifference) &&
    parseInt(queryInstance.importExportWeightDifference) <
    persistentIns.importExportExportDifference) {
    return true;
  }

  return false;
}

function isNotNullOrEmptyString(str) {
  return str && str.length > 0;
}

function areStringsNotEqual(baseStr, queryStr) {
  return isNotNullOrEmptyString(queryStr) &&
    baseStr.toLowerCase().indexOf(queryStr.toLowerCase()) === -1;
}
