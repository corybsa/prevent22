const sql = require('mssql');
const Helper = require('../../helper');
const StatementType = require('../../statement-type');
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
                
                helper.verifyPassword(req.body.Password, data.Hash, (err, success) => {
                    if(err) {
                        next(err, null);
                    } else if(!success) {
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

module.exports.register = (req, next) => {
    if(req.body.password !== req.body.confirmPassword) {
        return next({ message: 'Passwords do not match.' }, null);
    }

    try {
        helper.checkString(req, 'username', helper.REQUIRED);
        
        helper.hashPassword(req.body.password, (err, hash) => {
            params = [
                { name: 'StatementType', type: sql.Int, value: StatementType.Create },
                { name: 'Username', type: sql.NVarChar, value: req.body.username },
                { name: 'Hash', type: sql.NVarChar, value: hash }
            ];
    
            helper.exec('sp_Users', params, next);
        });
    } catch(e) {
        next({ message: e.message }, null);
    }
};
