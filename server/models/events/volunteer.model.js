const Helper = require('../../helper');
const StatementType = require('../../statement-type');
const helper = new Helper();

module.exports.get = (req, next) => {
    try {
        let params;

        req.body.Code = helper.generateCode();

        helper.checkNumber(req, 'UserId', helper.REQUIRED);

        params = helper.getParameters(StatementType.Get);

        helper.exec('sp_Volunteers', params, next);
    } catch(e) {
        next({ message: e.message }, null);
    }
};

module.exports.create = (req, next) => {
    try {
        let params;

        req.body.Code = helper.generateCode();

        helper.checkNumber(req, 'EventId', helper.REQUIRED);
        helper.checkNumber(req, 'UserId', helper.OPTIONAL);
        helper.checkString(req, 'FirstName', helper.OPTIONAL);
        helper.checkString(req, 'LastName', helper.OPTIONAL);
        helper.checkString(req, 'Email', helper.OPTIONAL);
        helper.checkString(req, 'Code', helper.OPTIONAL);

        params = helper.getParameters(StatementType.Create);

        helper.exec('sp_Volunteers', params, (err, data) => {
            // TODO: send email
            console.log('need to send email');

            next(err, data);
        });
    } catch(e) {
        next({ message: e.message }, null);
    }
};

module.exports.cancelVolunteer = (req, next) => {
    try {
        let params;

        helper.checkNumber(req, 'VolunteerId', helper.REQUIRED);

        params = helper.getParameters(StatementType.Delete);

        helper.exec('sp_Volunteers', params, next);
    } catch(e) {
        next({ message: e.message }, null);
    }
};

module.exports.cancelVolunteerByUserId = (req, next) => {
    try {
        let params;

        helper.checkNumber(req, 'EventId', helper.REQUIRED);
        helper.checkNumber(req, 'UserId', helper.REQUIRED);

        params = helper.getParameters(StatementType.Delete);

        helper.exec('sp_Volunteers', params, next);
    } catch(e) {
        next({ message: e.message }, null);
    }
};

module.exports.cancelVolunteerByCode = (req, next) => {
    try {
        let params;

        helper.checkNumber(req, 'EventId', helper.REQUIRED);
        helper.checkString(req, 'Code', helper.REQUIRED);

        params = helper.getParameters(StatementType.Delete);

        helper.exec('sp_Volunteers', params, next);
    } catch(e) {
        next({ message: e.message }, null);
    }
};