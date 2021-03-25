const sql = require('mssql');
const Helper = require('../../helper');
const StatementType = require('../../statement-type');
const helper = new Helper();

module.exports.getAll = (req, next) => {
    try {
        let params;

        params = helper.getParameters(req, false, StatementType.Get);

        helper.exec('sp_Boards', params, next);
    } catch(e) {
        next(e.message, null);
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
        next(e.message, null);
    }
};

module.exports.delete = (req, next) => {
    try {
        let params;

        helper.checkNumber(req, 'BoardId', helper.REQUIRED);

        params = helper.getParameters(req, true, StatementType.Delete);

        helper.exec('sp_Boards', params, next);
    } catch(e) {
        next(e.message, null);
    }
};
