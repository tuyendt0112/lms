const userRouter = require("./user");
const majorRouter = require("./major");
const departmentRouter = require("./department");
const topicRouter = require("./topic");
const { notFound, errHandler } = require("../middlewares/errorHandler");

const initRoutes = (app) => {
  app.use("/api/user", userRouter);
  app.use("/api/major", majorRouter);
  app.use("/api/department", departmentRouter);
  app.use("/api/topic", topicRouter);
  app.use(notFound);
  app.use(errHandler);
};

module.exports = initRoutes;
