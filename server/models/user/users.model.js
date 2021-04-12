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
