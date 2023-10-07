module.exports = function (connection) {
    return {
        "save": function (req, res, next) {
            connection.query("INSERT INTO application.dashboard(name, configuration, created_by, is_active, created_at)VALUES('Dashboard', ?, ?, b'1', CURRENT_TIMESTAMP);", [JSON.stringify(req.body), req.user.id], function (err, result, fields) {
                if (err) {
                    console.error(err);
                    res.status(500);
                    res.json({ error: err });
                } else {
                    res.status(200);
                    res.json({ message: "Configuration Saved!" });
                }
            });
        },
        "retrieve": function (req, res, next) {
            connection.query("SELECT name, configuration from application.dashboard where created_by=?", [req.user.id], function (err, result, fields) {
                if (err) {
                    console.error(err);
                    res.status(500);
                    res.json({ error: err });
                } else {
                    res.status(200);
                    res.json(result);
                }
            });
        }
    }
}
