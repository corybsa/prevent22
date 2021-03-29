const Helper = require('../../helper');
const StatementType = require('../../statement-type');
const helper = new Helper();

module.exports.getAll = (req, next) => {
    try {
        let params;

        helper.checkNumber(req, 'BoardId', helper.REQUIRED);

        params = helper.getParameters(req, false, StatementType.Get);

        helper.exec('sp_Threads', params, next);
    } catch(e) {
        next({ message: e.message }, null);
    }
};

module.exports.get = (req, next) => {
    try {
        let params;

        helper.checkNumber(req, 'ThreadId', helper.REQUIRED);

        params = helper.getParameters(req, false, StatementType.Get);

        helper.exec('sp_Threads', params, next);
    } catch(e) {
        next({ message: e.message }, null);
    }
};

module.exports.create = (req, next) => {
    try {
        let params;

        helper.checkNumber(req, 'BoardId', helper.REQUIRED);
        helper.checkString(req, 'ThreadName', helper.REQUIRED);
        helper.checkNumber(req, 'CreatedBy', helper.REQUIRED);

        params = helper.getParameters(req, false, StatementType.Create);

        helper.exec('sp_Threads', params, next);
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

        params = helper.getParameters(req, false, StatementType.Update);

        helper.exec('sp_Threads', params, next);
    } catch(e) {
        next({ message: e.message }, null);
    }
};

module.exports.delete = (req, next) => {
    try {
        let params;

        helper.checkNumber(req, 'ThreadId', helper.REQUIRED);

        params = helper.getParameters(req, false, StatementType.Delete);

        helper.exec('sp_Threads', params, next);
    } catch(e) {
        next({ message: e.message }, null);
    }
};
