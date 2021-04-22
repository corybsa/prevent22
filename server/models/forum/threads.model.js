const Helper = require('../../helper');
const StatementType = require('../../statement-type');
const helper = new Helper();

module.exports.getAll = (req, next) => {
    try {
        let params;

        helper.checkNumber(req, 'BoardId', helper.REQUIRED);

        params = helper.getParameters(StatementType.Get);

        helper.exec('sp_Threads', params, next);
    } catch(e) {
        next({ message: e.message }, null);
    }
};

module.exports.get = (req, next) => {
    try {
        let params;

        helper.checkNumber(req, 'ThreadId', helper.REQUIRED);

        params = helper.getParameters(StatementType.Get);

        helper.exec('sp_Threads', params, next);
    } catch(e) {
        next({ message: e.message }, null);
    }
};

module.exports.create = (req, next) => {
    try {
        let params;
        
        if(!!req.body.CreatorIsAnonymous) {
            if(!req.body.AnonymousEmail) { // need an email to send the code to
                next({ message: 'Email is required.' });
                return;
            }
            
            req.body.AnonymousCode = helper.generateCode(10);
        }

        helper.checkNumber(req, 'BoardId', helper.REQUIRED);
        helper.checkString(req, 'ThreadName', helper.REQUIRED);
        helper.checkNumber(req, 'CreatedBy', helper.OPTIONAL);
        helper.checkBoolean(req, 'CreatorIsAnonymous', helper.OPTIONAL);
        helper.checkString(req, 'AnonymousEmail', helper.OPTIONAL);
        helper.checkString(req, 'AnonymousCode', helper.OPTIONAL);

        params = helper.getParameters(StatementType.Create);

        helper.exec('sp_Threads', params, (err, data) => {
            if(!err) {
                data.recordset[0].IsAnonymous = !!req.body.CreatorIsAnonymous;
                data.recordset[0].Code = req.body.AnonymousCode;

                const to = req.body.AnonymousEmail;
                const subject = 'Prevent 22 - Forum reply code';
                let email = require('../../email-templates/anonymous-thread');

                email = email.replace('##REPLY_CODE##', req.body.AnonymousCode);
                helper.sendEmail(to, subject, email);
            }

            next(err, data);
        });
    } catch(e) {
        next({ message: e.message }, null);
    }
};

module.exports.update = (req, next) => {
    try {
        let params;

        helper.checkNumber(req, 'ThreadId', helper.REQUIRED);
        helper.checkNumber(req, 'BoardId', helper.REQUIRED);
        helper.checkString(req, 'ThreadName', helper.REQUIRED);
        helper.checkNumber(req, 'CreatedBy', helper.REQUIRED);
        helper.checkDateTime(req, 'CreatedDate', helper.REQUIRED);
        helper.checkBoolean(req, 'IsClosed', helper.REQUIRED);

        params = helper.getParameters(StatementType.Update);

        helper.exec('sp_Threads', params, next);
    } catch(e) {
        next({ message: e.message }, null);
    }
};

module.exports.delete = (req, next) => {
    try {
        let params;

        helper.checkNumber(req, 'ThreadId', helper.REQUIRED);

        params = helper.getParameters(StatementType.Delete);

        helper.exec('sp_Threads', params, next);
    } catch(e) {
        next({ message: e.message }, null);
    }
};
