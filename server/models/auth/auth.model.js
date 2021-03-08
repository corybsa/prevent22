const sql = require('mssql');
const crypto = require('crypto');
const Helper = require('../../helper');
const helper = new Helper();

module.exports.login = (req, next) => {
    try {
        const params = [
            { name: 'StatementType', type: sql.Int, value: 1 },
            { name: 'Username', type: sql.NVarChar, value: req.body.Username }
        ];

        helper.exec('sp_Users', params, (err, user) => {
            if (err) {
                next(err, null);
            } else {
                const data = helper.processResults(user.recordset[0]);

                if(!data) {
                    return next({ message: 'Invalid username or password.' }, null);
                }
                
                helper.verifyPassword(req.body.Password, data.Hash, (err, result) => {
                    if(err) {
                        next(err, null);
                    } else if(!result) {
                        next({ message: 'Invalid username or password.' }, null);
                    } else {
                        delete data.Hash;
                        next(null, data);
                    }
                });
            }
        });
    } catch (e) {
        next({ message: e.message }, null);
    }
};
