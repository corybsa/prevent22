const sql = require('mssql');
const Helper = require('../../helper');
const helper = new Helper();

module.exports.login = (req, next) => {
    try {
        const params = [
            { name: 'StatementType', type: sql.Int, value: 1 },
            { name: 'Username', type: sql.NVarChar, value: req.body.Username }
        ];

        helper.exec('sp_Users', params, (err, user) => {
            // TODO: check password

            if (err) {
                next(err, null);
            } else {
                next(null, helper.processResults(user.recordset[0]));
            }
        });
    } catch (e) {
        next({ message: e.message }, null);
    }
};
