const sql = require('mssql');
const Helper = require('../../helper');
const StatementType = require('../../statement-type');
const helper = new Helper();

module.exports.getAll = (req, next) => {
    try {
        let params;
        
        params = helper.getParameters(StatementType.Get);

        helper.exec('sp_Users', params, next);
    } catch(e) {
        next({ message: e.message }, null);
    }
};

module.exports.getEvents = (req, next) => {
    try {
        let params;
        
        helper.checkNumber(req, 'UserId', helper.REQUIRED);

        params = helper.getParameters(StatementType.Get);

        helper.exec('sp_Volunteers', params, next);
    } catch(e) {
        next({ message: e.message }, null);
    }
};

module.exports.getWarnings = (req, next) => {
    try {
        let params;
        
        helper.checkNumber(req, 'UserId', helper.REQUIRED);

        params = helper.getParameters(StatementType.Get);

        helper.exec('sp_Warnings', params, next);
    } catch(e) {
        next({ message: e.message }, null);
    }
};

module.exports.update = (req, next) => {
    try {
        let params;
        
        helper.checkNumber(req, 'UserId', helper.REQUIRED);
        helper.checkNumber(req, 'RoleId', helper.REQUIRED);
        helper.checkString(req, 'FirstName', helper.OPTIONAL);
        helper.checkString(req, 'LastName', helper.OPTIONAL);
        helper.checkString(req, 'Email', helper.OPTIONAL);
        helper.checkString(req, 'Country', helper.OPTIONAL);
        helper.checkString(req, 'State', helper.OPTIONAL);
        helper.checkString(req, 'City', helper.OPTIONAL);
        helper.checkString(req, 'ZipCode', helper.OPTIONAL);
        helper.checkString(req, 'Address', helper.OPTIONAL);
        helper.checkString(req, 'Phone', helper.OPTIONAL);
        helper.checkBoolean(req, 'IsBanned', helper.REQUIRED);
        helper.checkDateTime(req, 'BannedUntil', helper.OPTIONAL);
        helper.checkNumber(req, 'BannedById', helper.OPTIONAL);

        params = helper.getParameters(StatementType.Update);

        helper.exec('sp_Users', params, next);
    } catch(e) {
        next({ message: e.message }, null);
    }
};

module.exports.updatePassword = (req, next) => {
    try {
        let params;
        
        helper.checkString(req, 'Password', helper.REQUIRED);
        helper.checkString(req, 'Code', helper.REQUIRED);

        helper.hashPassword(req.body.Password, (err, hash) => {
            params = [
                { name: 'StatementType', type: sql.Int, value: StatementType.Update },
                { name: 'Code', type: sql.NVarChar, value: req.body.Code },
                { name: 'Hash', type: sql.NVarChar, value: hash }
            ];
            
            helper.exec('sp_Users', params, (err, data) => {
                if(!err) {
                    const to = data.recordset[0].email;
                    const subject = 'Prevent 22 - Password reset request';
                    let email = require('../../email-templates/reset-password-confirm');
                    helper.sendEmail(to, subject, email);
                }

                next(err, data);
            });
        });
    } catch(e) {
        next({ message: e.message }, null);
    }
};

module.exports.resetPassword = (req, next) => {
    try {
        let params;

        const code = helper.generateCode(16);
        req.body.Code = code;

        helper.checkString(req, 'Email', helper.OPTIONAL);
        helper.checkString(req, 'Code', helper.OPTIONAL);

        params = helper.getParameters(StatementType.Update);
        const to = req.body.Email;

        helper.exec('sp_Users', params, (err, data) => {
            if(!err) {
                const subject = 'Prevent 22 - Password reset request';
                let email = require('../../email-templates/reset-password-request');
                
                email = email.replace('##PASSWORD_TOKEN##', code);

                helper.sendEmail(to, subject, email);
            }

            next(err, data);
        });
    } catch(e) {
        next({ message: e.message }, null);
    }
};
