const { isAdmin } = require('../config/authentication/accessLevel')

const usersRoutes = require('./users/users.routes')
const ticketsRoutes = require('./tickets/tickets.routes')
const themesRoutes = require('./themes/themes.routes')
const categoriesRoutes = require('./categories/categories.routes')
const authRoutes = require('./auth/auth.routes')
const articlesRoutes = require('./articles/articles.routes')

/**
 *  @function
 *  @module Routes
 *  @description Provide routes to access resources.
 *  @param {Object} app - A app Object provided by consign.
 */
module.exports = app => {
  app.use('/public', app.express.static('public'))

  /**
   * @name Statistics
   * @description Statistics resources
   */
  app.route('/stats').all(app.config.authentication.passport.authenticate()).get(app.api.dashboard.countStats.get)

  app
    .route('/stats/synchronization')
    .all(app.config.authentication.passport.authenticate())
    .get(app.api.dashboard.countStats.lastSincronization)
    .post(isAdmin(app.api.dashboard.countStats.sincronizeManually))

  app
    .route('/stats/authors')
    .all(app.config.authentication.passport.authenticate())
    .patch(app.api.users.stats.definePlatformStats)

  articlesRoutes(app)
  authRoutes(app)
  categoriesRoutes(app)
  themesRoutes(app)
  ticketsRoutes(app)
  usersRoutes(app)
}
