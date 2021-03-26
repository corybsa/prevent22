const Helper = require('../../helper');
const StatementType = require('../../statement-type');
const helper = new Helper();

module.exports.get = (req, next) => {
    try {
        let params;

        helper.checkNumber(req, 'BoardId', helper.REQUIRED);

        params = helper.getParameters(req, false, StatementType.Get);

        helper.exec('sp_Threads', params, next);
    } catch(e) {
        next(e.message, null);
    }
};
