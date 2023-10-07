const passport = require("passport");
module.exports = function (express, authentication, db) {
    const router = express.Router({ mergeParams: true });
    const data_model = require("../db/data")(db);
    const dashboard = require("../db/dashboard")(db);
    router.post("/auth/login", authentication.login);
    router.post("/auth/register", authentication.register);
    router.get('/columns', passport.authenticate('jwt', { session: false }), data_model.get_columns)
    router.post('/data', passport.authenticate('jwt', { session: false }), data_model.data)
    router.post('/save', passport.authenticate('jwt', { session: false }), dashboard.save)
    router.get('/retrieve', passport.authenticate('jwt', { session: false }), dashboard.retrieve)
    return router
}
