const Helper = require('../../helper');
const StatementType = require('../../statement-type');
const helper = new Helper();

module.exports.getThreadPosts = (req, next) => {
    try {
        let params;

        helper.checkNumber(req, 'ThreadId', helper.REQUIRED);

        params = helper.getParameters(StatementType.Get);

        helper.exec('sp_Posts', params, next);
    } catch(e) {
        next({ message: e.message }, null);
    }
};

module.exports.create = (req, next) => {
    try {
        let params;
        let firstTimeAnon = false;
        
        if(!!req.body.CreatorIsAnonymous) {
            if(!req.body.AnonymousEmail) { // need an email to send the code to
                next({ message: 'Email is required.' });
                return;
            }

            if(!req.body.AnonymousCode && !req.body.CreatedBy) { // first time posting anonymously
                firstTimeAnon = true;
                req.body.AnonymousCode = helper.generateCode(10);
            }
        }

        helper.checkString(req, 'Message', helper.REQUIRED);
        helper.checkNumber(req, 'CreatedBy', helper.OPTIONAL);
        helper.checkNumber(req, 'ThreadId', helper.REQUIRED);
        helper.checkBoolean(req, 'CreatorIsAnonymous', helper.OPTIONAL);
        helper.checkString(req, 'AnonymousEmail', helper.OPTIONAL);
        helper.checkString(req, 'AnonymousCode', helper.OPTIONAL);

        params = helper.getParameters(StatementType.Create);

        helper.exec('sp_Posts', params, (err, data) => {
            if(!err) {
                // only send email if it's their first time posting anonymously
                // this also shouldn't send 2 emails to the TC
                if(firstTimeAnon) {
                    const to = req.body.AnonymousEmail;
                    const subject = 'Prevent 22 - Forum reply code';
                    let email = require('../../email-templates/anonymous-post');

                    email = email.replace('##REPLY_CODE##', req.body.AnonymousCode);
                    helper.sendEmail(to, subject, email);
                }
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

        helper.checkNumber(req, 'PostId', helper.REQUIRED);
        helper.checkString(req, 'Message', helper.REQUIRED);
        helper.checkNumber(req, 'CreatedBy', helper.REQUIRED);
        helper.checkDateTime(req, 'CreatedDate', helper.REQUIRED);
        helper.checkNumber(req, 'ThreadId', helper.REQUIRED);

        params = helper.getParameters(StatementType.Update);

        helper.exec('sp_Posts', params, next);
    } catch(e) {
        next({ message: e.message }, null);
    }
};

module.exports.delete = (req, next) => {
    try {
        let params;

        helper.checkNumber(req, 'PostId', helper.REQUIRED);

        params = helper.getParameters(StatementType.Delete);

        helper.exec('sp_Posts', params, next);
    } catch(e) {
        next({ message: e.message }, null);
    }
};
