const Helper = require('../../helper');
const StatementType = require('../../statement-type');
const helper = new Helper();

module.exports.get = (req, next) => {
    try {
        let params;

        helper.checkNumber(req, 'BoardId', helper.REQUIRED);

        params = helper.getParameters(req, false, StatementType.Get);

        helper.exec('sp_Boards', params, next);
    } catch(e) {
        next({ message: e.message }, null);
    }
};

module.exports.getAll = (req, next) => {
    try {
        let params;

        params = helper.getParameters(req, false, StatementType.Get);

        helper.exec('sp_Boards', params, next);
    } catch(e) {
        next({ message: e.message }, null);
    }
};

module.exports.create = (req, next) => {
    try {
        let params;

        helper.checkString(req, 'BoardName', helper.REQUIRED);
        helper.checkString(req, 'BoardDescription', helper.REQUIRED);

        params = helper.getParameters(req, true, StatementType.Create);

        helper.exec('sp_Boards', params, next);
    } catch(e) {
        next({ message: e.message }, null);
    }
};

module.exports.update = (req, next) => {
    try {
        let params;

        helper.checkNumber(req, 'BoardId', helper.REQUIRED);
        helper.checkString(req, 'BoardName', helper.REQUIRED);
        helper.checkString(req, 'BoardDescription', helper.REQUIRED);

        params = helper.getParameters(req, true, StatementType.Update);

        helper.exec('sp_Boards', params, next);
    } catch(e) {
        next({ message: e.message }, null);
    }
};

module.exports.delete = (req, next) => {
    try {
        let params;

        helper.checkNumber(req, 'BoardId', helper.REQUIRED);

        params = helper.getParameters(req, true, StatementType.Delete);

        helper.exec('sp_Boards', params, next);
    } catch(e) {
        next({ message: e.message }, null);
    }
};
