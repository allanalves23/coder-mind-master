const schedule = require('node-schedule')

/**
 * @function
 * @module cron
 * @description Manage cron jobs for aplication.
 * @param {Object} app - A app Object provided by consign.
 */
module.exports = app => {
  const { viewsJob } = app.api.articles.views
  const { commentsJob } = app.api.articles.comments.comments
  const { likesJob } = app.api.articles.likes

  const { validateFirstLoginTime, writeRemovedUsers } = app.api.users.users

  /**
   * @function
   * @description Run a syncronization job for migrate current views by autor and global to MySQL database.
   * @param {String} - A schedule config, run in every 01:00:00 AM.
   * @param {Function} - A callback to run job.
   */
  schedule.scheduleJob('00 01 * * *', () => {
    viewsJob()
  })

  /**
   * @function
   * @description Run a syncronization job for migrate current comments by autor and global to MySQL database.
   * @param {String} - A schedule config, run in every 02:00:00 AM.
   * @param {Function} - A callback to run job.
   */
  schedule.scheduleJob('00 02 * * *', () => {
    commentsJob()
  })

  /**
   * @function
   * @description Run a syncronization job for migrate current likes by autor and global to MySQL database.
   * @param {String} - A schedule config, run in every 03:00:00 AM.
   * @param {Function} - A callback to run job.
   */
  schedule.scheduleJob('00 03 * * *', () => {
    likesJob()
  })

  /**
   * @function
   * @description Run a syncronization job for get inactive users
   * (that not login in first time on seven days) and write these removed users.
   * @param {String} - A schedule config, run in every 04:00:00 AM.
   * @param {Function} - A callback to run job.
   */
  schedule.scheduleJob('00 04 * * *', async () => {
    const resultSet = await validateFirstLoginTime()
    writeRemovedUsers(resultSet)
  })
}
