const useRouter = require("./user");

const { notFound, errHandler } = require("../middlewares/errorHandler");

const initRoutes = (app) => {
  app.use("/api/user", useRouter);

  app.use(notFound);
  app.use(errHandler);
};

module.exports = initRoutes;
