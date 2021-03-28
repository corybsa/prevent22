const Helper = require('../../helper');
const StatementType = require('../../statement-type');
const helper = new Helper();

module.exports.getThreadPosts = (req, next) => {
    try {
        let params;

        helper.checkNumber(req, 'ThreadId', helper.REQUIRED);

        params = helper.getParameters(req, false, StatementType.Get);

        helper.exec('sp_Posts', params, next);
    } catch(e) {
        next(e.message, null);
    }
};

module.exports.create = (req, next) => {
    try {
        let params;

        helper.checkString(req, 'Message', helper.REQUIRED);
        helper.checkNumber(req, 'CreatedBy', helper.REQUIRED);
        helper.checkNumber(req, 'ThreadId', helper.REQUIRED);

        params = helper.getParameters(req, false, StatementType.Create);

        helper.exec('sp_Posts', params, next);
    } catch(e) {
        next(e.message, null);
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

        params = helper.getParameters(req, false, StatementType.Update);

        helper.exec('sp_Posts', params, next);
    } catch(e) {
        next(e.message, null);
    }
};

module.exports.delete = (req, next) => {
    try {
        let params;

        helper.checkNumber(req, 'PostId', helper.REQUIRED);

        params = helper.getParameters(req, false, StatementType.Delete);

        helper.exec('sp_Posts', params, next);
    } catch(e) {
        next(e.message, null);
    }
};
