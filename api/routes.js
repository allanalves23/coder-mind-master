const { isAdmin } = require('../config/authentication/accessLevel')

/**
 *  @function
 *  @module Routes
 *  @description Provide routes to access resources.
 *  @param {Object} app - A app Object provided by consign.
 */
module.exports = app => {
  /**
   * @name Public
   * @description Access to static resources
   */
  app.use('/public', app.express.static('public'))

  /**
   * @name Authentication
   * @description Authentication resources
   */
  app
    .route('/auth')
    .post(app.api.auth.auth.signIn)
    .patch(app.api.auth.redeemAccount.redeemPerEmail)
    .put(app.api.auth.redeemAccount.redeemPerMoreInformations)

  app
    .route('/auth/logged')
    .post(app.api.auth.auth.validateToken)
    .all(app.config.authentication.passport.authenticate())
    .patch(app.api.users.users.validateUserPassword)

  app
    .route('/auth/rescue')
    .post(app.api.auth.redeemAccount.validateToken)
    .patch(app.api.auth.redeemAccount.changePassword)
    .delete(app.api.auth.redeemAccount.removeAccount)

  /**
   * @name Articles
   * @description Articles resources
   */
  app
    .route('/articles')
    .all(app.config.authentication.passport.authenticate())
    .get(app.api.articles.articles.get)
    .post(app.api.articles.articles.create)
    .patch(app.api.articles.articles.existingArticlesByTitle)

  app
    .route('/articles/views')
    .all(app.config.authentication.passport.authenticate())
    .get(app.api.articles.views.views.get)

  app
    .route('/articles/views/latest')
    .all(app.config.authentication.passport.authenticate())
    .get(app.api.articles.views.views.getLatest)

  app
    .route('/articles/likes')
    .all(app.config.authentication.passport.authenticate())
    .get(app.api.articles.likes.likes.get)

  app
    .route('/articles/likes/latest')
    .all(app.config.authentication.passport.authenticate())
    .get(app.api.articles.likes.likes.getLatest)

  app
    .route('/articles/:id')
    .all(app.config.authentication.passport.authenticate())
    .put(app.api.articles.articles.save)
    .patch(app.api.articles.articles.changeState)
    .get(app.api.articles.articles.getOne)
    .delete(app.api.articles.articles.remove)

  app
    .route('/articles/:url')
    .all(app.config.authentication.passport.authenticate())
    .get(app.api.articles.articles.getOne)

  app
    .route('/articles/images/:id')
    .all(app.config.authentication.passport.authenticate())
    .post(app.api.articles.articles.saveImage)
    .delete(app.api.articles.articles.removeImage)

  /**
   * @name Users
   * @description Users resources
   */
  app
    .route('/users')
    .all(app.config.authentication.passport.authenticate())
    .get(isAdmin(app.api.users.users.get))
    .post(isAdmin(app.api.users.users.save))

  app
    .route('/users/:id')
    .all(app.config.authentication.passport.authenticate())
    .get(app.api.users.users.getOne)
    .delete(isAdmin(app.api.users.users.remove))
    .post(app.api.users.users.changeMyPassword)
    .patch(app.api.users.users.saveByMySelf)
    .put(isAdmin(app.api.users.users.save))

  app
    .route('/users/configs/:id')
    .all(app.config.authentication.passport.authenticate())
    .post(isAdmin(app.api.users.users.changePassword))
    .patch(isAdmin(app.api.users.users.restore))
    .put(app.api.users.users.remove)

  app
    .route('/users/emails/:id')
    .put(app.api.users.users.validateConfirmEmailToken)
    .delete(app.api.users.users.cancelChangeEmail)
    .all(app.config.authentication.passport.authenticate())
    .post(app.api.users.users.resendEmail)

  app
    .route('/users/img/:id')
    .all(app.config.authentication.passport.authenticate())
    .patch(app.api.users.users.saveProfileImage)
    .delete(app.api.users.users.removeProfileImage)

  /**
   * @name Themes
   * @description Themes resources
   */
  app
    .route('/themes')
    .all(app.config.authentication.passport.authenticate())
    .get(app.api.themes.themes.get)
    .post(isAdmin(app.api.themes.themes.save))

  app
    .route('/themes/:id')
    .all(app.config.authentication.passport.authenticate())
    .get(app.api.themes.themes.getOne)
    .delete(isAdmin(app.api.themes.themes.remove))
    .put(isAdmin(app.api.themes.themes.save))

  /**
   * @name Categories
   * @description Categories resources
   */
  app
    .route('/categories')
    .all(app.config.authentication.passport.authenticate())
    .get(app.api.categories.categories.get)
    .post(isAdmin(app.api.categories.categories.save))

  app
    .route('/categories/:id')
    .all(app.config.authentication.passport.authenticate())
    .delete(isAdmin(app.api.categories.categories.remove))
    .get(app.api.categories.categories.getOne)
    .put(isAdmin(app.api.categories.categories.save))

  app
    .route('/categories/theme/:id')
    .all(app.config.authentication.passport.authenticate())
    .get(app.api.categories.categories.getByTheme)

  /**
   * @name Comments
   * @description Comments resources
   */
  app
    .route('/comments')
    .all(app.config.authentication.passport.authenticate())
    .get(app.api.articles.comments.comments.get)
    .patch(app.api.articles.comments.comments.readAllComments)

  app
    .route('/comments/settings')
    .all(app.config.authentication.passport.authenticate())
    .get(app.api.articles.comments.settings.get)
    .post(app.api.articles.comments.settings.save)

  app
    .route('/comments/:id')
    .all(app.config.authentication.passport.authenticate())
    .get(app.api.articles.comments.comments.getById)
    .patch(app.api.articles.comments.comments.readComment)
    .post(app.api.articles.comments.comments.answerComment)
    .put(app.api.articles.comments.comments.enableComment)
    .delete(app.api.articles.comments.comments.disableComment)

  app
    .route('/comments/history/:id')
    .all(app.config.authentication.passport.authenticate())
    .get(app.api.articles.comments.comments.getHistory)

  app
    .route('/comments/answers/:id')
    .all(app.config.authentication.passport.authenticate())
    .put(app.api.articles.comments.comments.editAnswer)

  /**
   * @name Statistics
   * @description Statistics resources
   */
  app.route('/stats').all(app.config.authentication.passport.authenticate()).get(app.api.articles.countStats.get)

  app
    .route('/stats/sincronization')
    .all(app.config.authentication.passport.authenticate())
    .get(app.api.articles.countStats.lastSincronization)
    .post(isAdmin(app.api.articles.countStats.sincronizeManually))

  app
    .route('/stats/authors')
    .all(app.config.authentication.passport.authenticate())
    .patch(app.api.users.stats.definePlatformStats)

  /**
   * @name Tickets
   * @description Tickets resources
   */
  app
    .route('/tickets')
    .all(app.config.authentication.passport.authenticate())
    .post(app.api.tickets.tickets.save)
    .get(isAdmin(app.api.tickets.tickets.get))

  app.route('/tickets/unauthenticated').post(app.api.tickets.tickets.save)

  app
    .route('/tickets/notifications')
    .all(app.config.authentication.passport.authenticate())
    .get(isAdmin(app.api.tickets.tickets.getOnlyNotReaded))

  app
    .route('/tickets/:id')
    .all(app.config.authentication.passport.authenticate())
    .put(isAdmin(app.api.tickets.tickets.answerTicket))
    .patch(isAdmin(app.api.tickets.tickets.readTicket))
    .get(isAdmin(app.api.tickets.tickets.getOne))
}