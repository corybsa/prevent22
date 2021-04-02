const Helper = require('../../helper');
const StatementType = require('../../statement-type');
const helper = new Helper();
const config = require('../../config/config');
const moment = require('moment');

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

        const code = helper.generateCode();
        req.body.Code = code;

        helper.checkNumber(req, 'EventId', helper.REQUIRED);
        helper.checkNumber(req, 'UserId', helper.OPTIONAL);
        helper.checkString(req, 'FirstName', helper.OPTIONAL);
        helper.checkString(req, 'LastName', helper.OPTIONAL);
        helper.checkString(req, 'Email', helper.OPTIONAL);
        helper.checkString(req, 'Code', helper.OPTIONAL);

        params = helper.getParameters(StatementType.Create);
        const to = req.body.Email;

        helper.exec('sp_Volunteers', params, (err, data) => {
            if(!err) {
                const event = helper.processResults(data.recordset[0]);
                const subject = `Registration for ${event.title}`;
                let email = require('../../email-templates/volunteer-register');
                
                email = email.replace('##EVENT_TITLE##', event.title)
                             .replace('##EVENT_START##', moment(event.start).format('MMMM Do YYYY hh:mm a'))
                             .replace('##EVENT_END##', moment(event.end).format('MMMM Do YYYY hh:mm a'))
                             .replace('##EVENT_LOCATION##', event.location ? event.location : 'No location specified')
                             .replace('##REGISTRATION_CODE##', code);

                helper.sendEmail(to, subject, email);
            }

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