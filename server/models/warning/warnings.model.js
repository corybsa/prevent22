const Helper = require('../../helper');
const StatementType = require('../../statement-type');
const helper = new Helper();

module.exports.getAll = (req, next) => {
    try {
        let params = helper.getParameters(StatementType.Get);

        helper.exec('sp_Warnings', params, next);
    } catch(e) {
        next({ message: e.message }, null);
    }
};

module.exports.get = (req, next) => {
    try {
        let params;
        
        helper.checkNumber(req, 'WarningId', helper.REQUIRED);

        params = helper.getParameters(StatementType.Get);

        helper.exec('sp_Warnings', params, next);
    } catch(e) {
        next({ message: e.message }, null);
    }
};

module.exports.create = (req, next) => {
    try {
        let params;

        helper.checkString(req, 'WarningReason', helper.REQUIRED);
        helper.checkNumber(req, 'UserId', helper.REQUIRED);
        helper.checkNumber(req, 'CreatedById', helper.REQUIRED);
        helper.checkNumber(req, 'PostId', helper.REQUIRED);
        helper.checkBoolean(req, 'ShouldBanUser', helper.REQUIRED);
        helper.checkDateTime(req, 'BanUntil', helper.OPTIONAL);

        params = helper.getParameters(StatementType.Create);

        helper.exec('sp_Warnings', params, next);
    } catch(e) {
        next({ message: e.message }, null);
    }
};

module.exports.update = (req, next) => {
    try {
        let params;

        helper.checkNumber(req, 'WarningId', helper.REQUIRED);
        helper.checkString(req, 'WarningReason', helper.REQUIRED);
        helper.checkDateTime(req, 'WarningDate', helper.REQUIRED);
        helper.checkNumber(req, 'UserId', helper.REQUIRED);
        helper.checkNumber(req, 'CreatedById', helper.REQUIRED);
        helper.checkNumber(req, 'PostId', helper.REQUIRED);

        params = helper.getParameters(StatementType.Update);

        helper.exec('sp_Warnings', params, next);
    } catch(e) {
        next({ message: e.message }, null);
    }
};

module.exports.delete = (req, next) => {
    try {
        let params;

        helper.checkNumber(req, 'WarningId', helper.REQUIRED);

        params = helper.getParameters(StatementType.Delete);

        helper.exec('sp_Warnings', params, next);
    } catch(e) {
        next({ message: e.message }, null);
    }
};
