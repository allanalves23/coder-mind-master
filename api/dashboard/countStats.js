module.exports = app => {
  const getViews = app.api.articles.views.views.getCount
  const getLikes = app.api.articles.likes.likes.getCount

  const { synchronizeViews } = app.api.articles.views.views
  const { synchronizeComments } = app.api.articles.comments.comments
  const { synchronizeLikes } = app.api.articles.likes.likes

  const defineMonthDescribed = require('../../config/validation')().defineMonthDescribed

  const get = async (req, res) => {
    try {
      const year = req.query.y || new Date().getFullYear()

      const user = req.user.user.tagAdmin && req.user.user.platformStats ? null : req.user.user._id

      const views = await getViews(user)
      const likes = await getLikes(user)

      const chartData = await getStatsForChart(year, user)

      return res.json({ views: views.count, likes: likes.count, chartData })
    } catch (error) {
      return res.status(500).send('Ocorreu um erro ao obter as estatísticas, se persistir reporte')
    }
  }

  const getStatsForChart = async (year, user = null) => {
    try {
      const result = await app.knex.raw(`select
            month as month_numbered,
            CASE 
                WHEN month = 1 THEN 'JANEIRO'
                WHEN month = 2 THEN 'FEVEREIRO'
                WHEN month = 3 THEN 'MARÇO'
                WHEN month = 4 THEN 'ABRIL'
                WHEN month = 5 THEN 'MAIO'
                WHEN month = 6 THEN 'JUNHO'
                WHEN month = 7 THEN 'JULHO'
                WHEN month = 8 THEN 'AGOSTO'
                WHEN month = 9 THEN 'SETEMBRO'
                WHEN month = 10 THEN 'OUTUBRO'
                WHEN month = 11 THEN 'NOVEMBRO'
                WHEN month = 12 THEN 'DEZEMBRO'
            END AS month,
            max(quantity) as views,
            (SELECT max(count) from comments where month = a.month and year = ${year} and reference ${
        user ? `= '${user}'` : 'is null'
      }) as comments,
            (SELECT max(count) from likes where month = a.month and year = ${year} and reference ${
        user ? `= '${user}'` : 'is null'
      }) as likes
        from (
            select 
                max(month) as month,
                max(count) as quantity
            from views 
            where year = ${year}
            and reference ${user ? `= '${user}'` : 'is null'}
            group by month) a
        GROUP BY
            month,
            CASE 
                WHEN month = 1 THEN 'JANEIRO'
                WHEN month = 2 THEN 'FEVEREIRO'
                WHEN month = 3 THEN 'MARÇO'
                WHEN month = 4 THEN 'ABRIL'
                WHEN month = 5 THEN 'MAIO'
                WHEN month = 6 THEN 'JUNHO'
                WHEN month = 7 THEN 'JULHO'
                WHEN month = 8 THEN 'AGOSTO'
                WHEN month = 9 THEN 'SETEMBRO'
                WHEN month = 10 THEN 'OUTUBRO'
                WHEN month = 11 THEN 'NOVEMBRO'
                WHEN month = 12 THEN 'DEZEMBRO'
            END
        ORDER BY
            month_numbered;`)

      const data = {
        monthNumbered: [],
        month: [],
        views: [],
        comments: [],
        likes: [],
        originalDataPacket: result[0]
      }

      for (let i = 1; i <= 12; i++) {
        data.monthNumbered.push(
          result[0].filter(elem => elem.month_numbered === i).length > 0
            ? result[0].filter(elem => elem.month_numbered === i)[0].month_numbered
            : i
        )
        data.month.push(
          result[0].filter(elem => elem.month_numbered === i).length > 0
            ? result[0].filter(elem => elem.month_numbered === i)[0].month
            : defineMonthDescribed(i)
        )
        data.views.push(
          result[0].filter(elem => elem.month_numbered === i).length > 0
            ? result[0].filter(elem => elem.month_numbered === i)[0].views
            : 0
        )
        data.comments.push(
          result[0].filter(elem => elem.month_numbered === i).length > 0
            ? result[0].filter(elem => elem.month_numbered === i)[0].comments
            : 0
        )
        data.likes.push(
          result[0].filter(elem => elem.month_numbered === i).length > 0
            ? result[0].filter(elem => elem.month_numbered === i)[0].likes
            : 0
        )
      }

      return data
    } catch (error) {
      throw 'Ocorreu um erro ao obter as estatísticas, se persistir reporte'
    }
  }

  const lastSincronization = async (req, res) => {
    try {
      const result = await getLastSincronization()
      res.json(result)
    } catch (error) {
      res.status(500).send('Ocorreu um erro ao obter as estatísticas, se persistir reporte')
    }
  }

  const getLastSincronization = () => {
    return app.knex.select('generated_at as generatedAt').from('views').orderBy('id', 'desc').first()
  }

  const sincronizeManually = async (req, res) => {
    try {
      await synchronizeViews()
      await synchronizeComments()
      await synchronizeLikes()

      const response = await getLastSincronization()

      res.json(response)
    } catch (error) {
      res.status(500).send('Ocorreu um erro ao sincronizar as estatísticas, se persistir reporte')
    }
  }

  return { get, getStatsForChart, lastSincronization, sincronizeManually }
}
