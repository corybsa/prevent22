const Helper = require('../../helper');
const StatementType = require('../../statement-type');
const helper = new Helper();

module.exports.getAll = (req, next) => {
    try {
        let params = helper.getParameters(StatementType.Get);

        helper.exec('sp_Events', params, next);
    } catch(e) {
        next({ message: e.message }, null);
    }
};

module.exports.get = (req, next) => {
    try {
        let params;

        helper.checkNumber(req, 'EventId', helper.REQUIRED);

        params = helper.getParameters(StatementType.Get);

        helper.exec('sp_Events', params, next);
    } catch(e) {
        next({ message: e.message }, null);
    }
};

module.exports.getVolunteers = (req, next) => {
    try {
        let params;

        helper.checkNumber(req, 'EventId', helper.REQUIRED);

        params = helper.getParameters(StatementType.Get);

        helper.exec('sp_Volunteers', params, next);
    } catch(e) {
        next({ message: e.message }, null);
    }
};

module.exports.create = (req, next) => {
    try {
        let params;

        helper.checkString(req, 'title', helper.REQUIRED);
        helper.checkString(req, 'description', helper.OPTIONAL);
        helper.checkString(req, 'location', helper.OPTIONAL);
        helper.checkDateTime(req, 'start', helper.REQUIRED);
        helper.checkDateTime(req, 'end', helper.REQUIRED);
        helper.checkBoolean(req, 'allDay', helper.REQUIRED);
        helper.checkString(req, 'daysOfWeek', helper.OPTIONAL);
        helper.checkString(req, 'startTime', helper.OPTIONAL);
        helper.checkString(req, 'endTime', helper.OPTIONAL);
        helper.checkDateTime(req, 'startRecur', helper.OPTIONAL);
        helper.checkDateTime(req, 'endRecur', helper.OPTIONAL);
        helper.checkString(req, 'groupId', helper.OPTIONAL);

        params = helper.getParameters(StatementType.Create);

        helper.exec('sp_Events', params, next);
    } catch(e) {
        next({ message: e.message }, null);
    }
};

module.exports.update = (req, next) => {
    try {
        let params;

        helper.checkNumber(req, 'EventId', helper.REQUIRED);
        helper.checkString(req, 'title', helper.REQUIRED);
        helper.checkString(req, 'description', helper.OPTIONAL);
        helper.checkString(req, 'location', helper.OPTIONAL);
        helper.checkDateTime(req, 'start', helper.REQUIRED);
        helper.checkDateTime(req, 'end', helper.REQUIRED);
        helper.checkBoolean(req, 'allDay', helper.REQUIRED);
        helper.checkString(req, 'daysOfWeek', helper.OPTIONAL);
        helper.checkString(req, 'startTime', helper.OPTIONAL);
        helper.checkString(req, 'endTime', helper.OPTIONAL);
        helper.checkDateTime(req, 'startRecur', helper.OPTIONAL);
        helper.checkDateTime(req, 'endRecur', helper.OPTIONAL);
        helper.checkString(req, 'groupId', helper.OPTIONAL);

        params = helper.getParameters(StatementType.Update);

        helper.exec('sp_Events', params, next);
    } catch(e) {
        next({ message: e.message }, null);
    }
};

module.exports.delete = (req, next) => {
    try {
        let params;

        helper.checkNumber(req, 'EventId', helper.REQUIRED);

        params = helper.getParameters(StatementType.Delete);

        helper.exec('sp_Events', params, next);
    } catch(e) {
        next({ message: e.message }, null);
    }
};
