const useRouter = require('./user')
const pitchRouter = require('./pitch')
const pitchCategoryRouter = require('./pitchCategory')
const blogCategoryRouter = require('./blogCategory')
const blog = require('./blog')

const { notFound, errHandler } = require('../middlewares/errorHandler')

const initRoutes = (app) => {
    app.use('/api/user', useRouter)
    app.use('/api/pitch', pitchRouter)
    app.use('/api/pitchcategory', pitchCategoryRouter)
    app.use('/api/blogcategory', blogCategoryRouter)
    app.use('/api/blog', blog)






    app.use(notFound)
    app.use(errHandler)
}

module.exports = initRoutes