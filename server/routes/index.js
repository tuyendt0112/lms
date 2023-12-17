const useRouter = require('./user')
const majorRouter = require("./major");
const departmentRouter = require("./department");
const pitchRouter = require('./pitch')
const pitchCategoryRouter = require('./pitchCategory')
const brand = require('./brand')
const bookingRouter = require("./booking");

const { notFound, errHandler } = require('../middlewares/errorHandler')

const initRoutes = (app) => {
    app.use('/api/user', useRouter)
    app.use('/api/pitch', pitchRouter)
    app.use("/api/major", majorRouter);
    app.use("/api/department", departmentRouter);
    app.use('/api/pitchcategory', pitchCategoryRouter)
    app.use('/api/brand', brand)
    app.use("/api/booking", bookingRouter);
    app.use(notFound)
    app.use(errHandler)
}

module.exports = initRoutes