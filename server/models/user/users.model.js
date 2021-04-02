const Helper = require('../../helper');
const StatementType = require('../../statement-type');
const helper = new Helper();

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