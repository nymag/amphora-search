'use strict';
const utils = require('./utils');

/**
 * set page in list as scheduled
 * @param  {string} uri
 * @param  {object} data
 * @param  {object} user
 */
function onSchedule({ uri, data, user }) {
  utils.getPage(uri).then(function (page) {
    page.scheduled = true;
    page.scheduledTime = utils.utcDate(data.at);
    page.history.push({ action: 'schedule', timestamp: new Date(), users: [utils.userOrRobot(user)] });

    utils.updatePage(uri, page);
  });
}

module.exports = onSchedule;