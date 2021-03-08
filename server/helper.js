const sql = require('mssql');
const moment = require('moment');
const config = require('../server/config/config');
// const multer = require('multer');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
// const fs = require('fs');

class ApiError {
    constructor(name, message) {
        this.name = name;
        this.message = message;
    }
}

class Helper {
    constructor() {
        this.REQUIRED = true;
        this.OPTIONAL = false;
        this.DATE_FORMAT = 'YYYY-MM-DD';
        this.DATETIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
        this.RED_TEXT = '\x1b[31m%s\x1b[0m';
        this.GREEN_TEXT = '\x1b[32m%s\x1b[0m';
        this.YELLOW_TEXT = '\x1b[33m%s\x1b[0m';
        this.BLUE_TEXT = '\x1b[34m%s\x1b[0m';
        this.params = [];

        this.roles = {

        };

        this.sqlConfig = config.sql;
    }

    /**
     * Executes a stored procedure with parameters and executes the next function once completed.
     *
     * @param {string} procedure - The procedure to call.
     * @param {*[]} [params] - The parameters to send to SQL.
     * @param {Function} next - The function to execute once the stored procedure is finished.
     */
    exec(procedure, params, next) {
        if (!this.sqlConfig) {
            throw new Error('sqlConfig not set. Check database config.')
        }

        // create new connection.
        const pool = new sql.ConnectionPool(this.sqlConfig, err => {
            if (err) {
                this.logMessage(`sql.ConnectionPool err: ${err}`, this.RED_TEXT, true);
            }

            try {
                // create a request.
                let request = pool.request();

                // attach parameters if needed.
                if (params) {
                    for (const param of params) {
                        request.input(param.name, param.type, param.value);
                    }
                }

                this.logRequest(procedure, params);

                // to prevent race conditions
                this.params = [];

                // execute stored procedure.
                return request.execute(procedure, (err, result) => {
                    if (err) {
                        const timestamp = new Date();
                        let type;

                        if (err.code === 'ETIMEOUT') {
                            type = 'Timeout';
                        } else if (err.message.match('too many') !== null) {
                            type = 'Too many args';
                        } else {
                            type = 'Other';
                        }

                        this.logRequest(procedure, params, true);
                        this.logError(type, timestamp, err.message, procedure, params);
                    }

                    // close connection.
                    pool.close();

                    // return err and result info to client.
                    next(err, result);
                });
            } catch (e) {
                console.log(e);
                return;
            }
        });

        // listen for errors
        pool.on('error', err => {
            // return error information to client.
            next(err, null);
        });
    }

    /**
     * Logs the SQL request to the console.
     *
     * @param {string} procedure - The procedure name.
     * @param {*} params - The parameters being sent.
     * @param [override] - Flag to log in prod
     */
    logRequest(procedure, params, override = false) {
        if (params) {
            const paramsLog = params.map(param => param.value);

            for (let i = 0; i < paramsLog.length; i++) {
                switch (this.getParamType(paramsLog[i])) {
                    case sql.Bit:
                        break;
                    case sql.Int:
                        break;
                    case sql.DateTime:
                    case sql.NconstChar:
                        paramsLog[i] = `\'${paramsLog[i]}\'`;
                        break;
                }
            }

            this.logMessage(`EXEC ${procedure} ${paramsLog.join(', ')}`, this.BLUE_TEXT, override);
        } else {
            this.logMessage(`EXEC ${procedure}`, this.BLUE_TEXT, override);
        }
    }

    /**
     * Logs the SQL request to the console.
     *
     * @param {string} color - The font color the message should be.
     * @param {string} [message] - The message to log.
     * @param {boolean} [override] - Forcefully log the message.
     */
    logMessage(message, color = this.BLUE_TEXT, override = false) {
        // disable in prod to improve performance
        if (process.env.NODE_ENV !== 'prod' || override) {
            console.log(color, `${message}`);
        }
    }

    logError(type, timestamp, message, procedure, params) {
        let exec;

        if (params) {
            const paramsLog = params.map(param => param.value);

            for (let i = 0; i < paramsLog.length; i++) {
                switch (this.getParamType(paramsLog[i])) {
                    case sql.Bit:
                        break;
                    case sql.Int:
                        break;
                    case sql.DateTime:
                    case sql.NconstChar:
                        paramsLog[i] = `\'${paramsLog[i]}\'`;
                        break;
                }
            }

            exec = `EXEC ${procedure} ${paramsLog.join(', ')}`;
        } else {
            exec = `EXEC ${procedure}`;
        }
    }

    /**
     * Shuffle a string.
     * @param {string} string - The string to shuffle.
     * @returns {string} - The shuffled string.
     */
    shuffleString(string) {
        const strArray = string.split('');
        const length = strArray.length;

        for (let i = 0; i < length; i++) {
            const index = Math.floor(Math.random() * (i + 1));
            let temp = strArray[i];
            strArray[i] = strArray[index];
            strArray[index] = temp;
        }

        return strArray.join('');
    }

    /* getMulter(folder, hashName = true) {
      const storage = multer.diskStorage({
        destination: (req, file, callback) => {
          callback(null, `/mnt/web/${process.env.UPLOAD_PATH}/${folder}`);
        },
        filename: (req, file, callback) => {
          let filename = file.originalname;
  
          // extract file extension
          const ext = file.originalname.substring(filename.lastIndexOf('.'));
          filename = filename.substring(0, filename.lastIndexOf('.'));
  
          if(hashName) {
            // hash filename with pbkdf2
            const key = crypto.pbkdf2Sync(filename, this.shuffleString(file.originalname), 100, 32, 'sha512');
            filename = key.toString('hex');
          }
  
          callback(null, `${filename}${ext}`);
        }
      });
  
      return multer({ storage });
    } */

    hashPassword(password, callback) {
        bcrypt.hash(password, config.crypto.costFactor, callback);
    }

    verifyPassword(password, hash, callback) {
        bcrypt.compare(password, hash, callback);
    }

    /**
     * Gets SQL type based on <code>param</code>
     *
     * @param {*} param - The value to check.
     * @returns {*} The SQL type.
     */
    getParamType(param) {
        if (!param) {
            return sql.NconstChar;
        }

        if (/^true$|^false$/i.test(param)) {
            return sql.Bit;
        }

        if (!isNaN(+param) && !param.startsWith) {
            return sql.Int;
        }

        if (/^\d{4}-\d{2}-\d{2}(\s\d{2}:\d{2}:\d{2})?$/.test(param)) {
            return sql.DateTime;
        }

        return sql.NconstChar;
    }

    /**
     * Get all parameters formatted to send to SQL.
     *
     * @param {*} req - The request from the client.
     * @param {boolean} personRowId - Whether or not to provide the PersonRowId.
     * @param {boolean} entityRowId - Whether or not to provide the EntityRowId.
     * @param {boolean} userRoleRowId - Whether or not to provide the UserRoleRowId.
     * @returns {*} The formatted parameters or null if there are no parameters.
     */
    getParameters(req, personRowId = false, entityRowId = false, userRoleRowId = false) {
        const params = [];

        if (!req.session.passport) {
            // if we don't clear the parameters between calls they will just keep appending to this array.
            this.params = [];

            throw new ApiError('test name', { name: 'session', message: 'Session has expired. Please refresh the page.' });
        }

        const user = JSON.parse(req.session.passport.user);

        if (personRowId) {
            params.push({ name: 'PersonRowId', type: sql.Int, value: user.PersonRowId || null });
        }

        if (entityRowId) {
            params.push({ name: 'EntityRowId', type: sql.Int, value: user.EntityRowId });
        }

        if (userRoleRowId) {
            params.push({ name: 'UserRoleRowId', type: sql.Int, value: user.UserRoleRowId });
        }

        for (const prop of this.params) {
            params.push({ name: prop.name.trim(), type: prop.dataType, value: prop.value });
        }

        // if we don't clear the parameters between calls they will just keep appending to this array.
        this.params = [];

        return params.length > 0 ? params : null;
    }

    /**
     * Get all parameters formatted to send to SQL.
     *
     * @param {string} name - The request from the client.
     * @param {*} value - The request from the client.
     * @param {*[]} params - The request from the client.
     * @returns {*} The formatted parameters or null if there are no parameters.
     */
    prependParam(name, value, params) {
        if (!name || name === '') {
            throw new Error(`Parameter 'name' must be defined.`);
        }

        if (!value) {
            throw new Error(`Parameter 'type' must be defined.`);
        }

        if (!params) {
            throw new Error(`Parameter 'params' must be defined.`);
        }

        params.unshift({ name: name, type: this.getParamType(value), value: value });
        return params;
    }

    /**
     * Finds the request object that the parameter is in.
     *
     * @param {*} req - The request from the client.
     * @param {string} param - The parameter to find.
     * @param {boolean} isRequired - Whether or not the parameter is required.
     * @param {*} dataType - The data type of the <code>param</code>.
     * @returns {*} The object that the parameter is in.
     */
    getParameter(req, param, isRequired = true, dataType) {
        for (const x in req.params) {
            if (Object.hasOwnProperty.call(req.params, param)) {
                return req.params;
            }
        }

        for (const x in req.query) {
            if (Object.hasOwnProperty.call(req.query, param)) {
                return req.query;
            }
        }

        for (const x in req.body) {
            if (Object.hasOwnProperty.call(req.body, param)) {
                return req.body;
            }
        }

        if (!isRequired) {
            const dummy = {};
            const value = this.getDefaultValue(dataType);

            this.logMessage(`Warning: ${param} not found. Using '${value}' as default value!`, this.YELLOW_TEXT);

            dummy[param] = value;

            return dummy;
        } else {
            // if we don't clear the parameters after an error they will just keep appending to this array.
            this.params = [];
            throw new Error(`${param} not found.`);
        }
    }

    /**
     * Returns a default value based on the <code>dataType</code>.
     *
     * @param {*} dataType - The type of data.
     * @returns {*} The default value for <code>dataType</code>.
     */
    getDefaultValue(dataType) {
        switch (dataType) {
            case sql.Int:
            case sql.TinyInt:
                return 0;
            case sql.Bit:
                return false;
            case sql.DateTime:
                return null;
            case sql.NconstChar:
                return '';
            default:
                return '';
        }
    }

    /**
     * Check if a number is valid.
     *
     * @param {*} req - The request from the client.
     * @param {string} param - The parameter to check.
     * @param {boolean} isRequired - Whether or not the parameters is required.
     * @param {*} type - the data type to be sent to sql.
     */
    checkNumber(req, param, isRequired = true, type = sql.Int) {
        const params = this.getParameter(req, param, isRequired, type);

        if (isNaN(+params[param])) {
            // if we don't clear the parameters after an error they will just keep appending to this array.
            this.params = [];
            throw new Error(`${param} must be a number.`);
        }

        this.params.push({ name: param, dataType: sql.Int, value: params[param] });
    }

    /**
     * Check if a date is valid.
     *
     * @param {*} req - The request from the client.
     * @param {string} param - The parameter to check.
     * @param {boolean} isRequired - Whether or not the parameters is required.
     */
    checkDate(req, param, isRequired = true) {
        const params = this.getParameter(req, param, isRequired, sql.DateTime);

        if (params[param] !== null) {
            if (isNaN(Date.parse(params[param])) || !moment(Date.parse(params[param])).isValid()) {
                // if we don't clear the parameters after an error they will just keep appending to this array.
                this.params = [];
                throw new Error(`${param} must be a date.`);
            }
        }

        params[param] = params[param] !== null ? moment(Date.parse(params[param])).format(this.DATE_FORMAT) : null;

        this.params.push({ name: param, dataType: sql.NconstChar, value: params[param] });
    }

    /**
     * Check if a datetime is valid.
     *
     * @param {*} req - The request from the client.
     * @param {string} param - The parameter to check.
     * @param {boolean} isRequired - Whether or not the parameters is required.
     */
    checkDateTime(req, param, isRequired = true) {
        const params = this.getParameter(req, param, isRequired, sql.DateTime);

        if (params[param] !== null) {
            if (isNaN(Date.parse(params[param])) || !moment(Date.parse(params[param])).isValid()) {
                // if we don't clear the parameters after an error they will just keep appending to this array.
                this.params = [];
                throw new Error(`${param} must be a date.`);
            }
        }

        params[param] = params[param] !== null ? moment(Date.parse(params[param])).format(this.DATETIME_FORMAT) : null;

        this.params.push({ name: param, dataType: sql.NconstChar, value: params[param] });
    }

    /**
     * Check if a boolean is valid.
     *
     * @param {*} req - The request from the client.
     * @param {string} param - The parameter to check.
     * @param {boolean} isRequired - Whether or not the parameters is required.
     */
    checkBoolean(req, param, isRequired = true) {
        const params = this.getParameter(req, param, isRequired, sql.Bit);

        if (params && (param in params)) {
            // GET requests always toString() values, so we need to change booleans to an actual boolean
            if (req.method === 'GET') {
                params[param] = params[param] === 'true';
            }

            if (!/^1$|^true$|^0$|^false$/i.test(params[param])) {
                // if we don't clear the parameters after an error they will just keep appending to this array.
                this.params = [];
                throw new Error(`${param} must be a boolean.`);
            }

            if (typeof params[param] === 'boolean') {
                req.query[param] = params[param] === true ? 1 : 0;
            }
        } else {
            req.query[param] = false;
        }

        this.params.push({ name: param, dataType: sql.Bit, value: req.query[param] });
    }

    /**
     * Check if a string is valid.
     *
     * @param {*} req - The request from the client.
     * @param {string} param - The parameter to check.
     * @param {boolean} isRequired - Whether or not the parameters is required.
     * @param {string[]} [validValues] - The valid that are allowed to be passes.
     */
    checkString(req, param, isRequired = true, validValues) {
        const params = this.getParameter(req, param, isRequired, sql.NconstChar);

        if (validValues) {
            let valid = false;

            for (const value of validValues) {
                if (params[param] === value) {
                    valid = true;
                }
            }

            if (!valid) {
                // if we don't clear the parameters after an error they will just keep appending to this array.
                this.params = [];
                throw new Error(`${param} must be one of ${validValues.join(', ')}`);
            }
        }

        this.params.push({ name: param, dataType: sql.NconstChar, value: params[param] });
    }

    /**
     * Authenticate user against active directory.
     *
     * @param {string} username - The username of the user.
     * @param {string} password - The password of the user.
     * @param {Function} next - Function to execute once user is found.
     */
    authenticateUser(username, password, next) {
        if (this.ad) {
            this.ad.user(username).get()
                .then(user => {
                    if (Object.keys(user).length > 0) {
                        this.ad.user(username).authenticate(password)
                            .then(authenticated => {
                                next(null, authenticated);
                            })
                            .catch(err => next(err, null));
                    } else {
                        next(`${username} doesn't exist`, null);
                    }
                })
                .catch(err => next(err, null));
        } else {
            next('Could not connect to active directory.', null);
        }
    }

    /**
     * Logs the user in.
     *
     * @param {string} username - The username of the user.
     * @param {string} password - The password of the user.
     * @param {Function} next - Function to execute once user is found.
     */
    login(username, password, next) {
        this.authenticateUser(username, password, (err, result) => {
            this.loginSuccess(username, password, err, result, next);
        });
    }

    /**
     * Method to run after authenticating the user. This function is recursive until it gets either a success message or
     * an error other than ECONNREFUSED.
     *
     * @param {string} username - The username of the user.
     * @param {string} password - The password of the user.
     * @param {*} err - The error object.
     * @param {boolean} result - The result of the authentication.
     * @param {Function} next - The function to execute after we try to get the user from the database.
     */
    loginSuccess(username, password, err, result, next) {
        if (result) {
            username = username.replace(/(@leeschools.net)|(@students.leeschools.net)/gi, '');

            if (this.ad) {
                this.ad.user(username)
                    .get({
                        fields: [
                            'dn',
                            'sAMAccountName',
                            'mail',
                            'sn',
                            'givenName',
                            'displayName'
                        ]
                    })
                    .then((u) => {
                        this.getDatabaseUser(username, next);
                    })
                    .catch(e => next(e, null));
            } else {
                next('Could not connect to active directory.', null);
            }
        } else {
            this.logMessage(err, this.RED_TEXT);
            if (err && err.code === 'ECONNREFUSED') {
                // keep trying until there is a real error.
                this.login(username, password, next);
            } else {
                next({ message: 'Wrong username/password combination.' }, null);
            }
        }
    }

    getDatabaseUser(username, next) {
        const params = [
            { name: 'NetworkID', type: sql.NconstChar, value: `LCSD\\${username}` }
        ];

        this.use(this.dbTypes.CASTLE).exec('Castle.spGetUser', params, (err, user) => {
            if (!err) {
                this.logUser(user.recordset[0].NetworkID, user.recordset[0].EntityRowId);
                next(null, user);
            } else {
                next(err, null);
            }
        });
    }

    logUser(username, locationId) {
        const params = [
            { name: 'NetworkID', type: sql.NconstChar, value: username },
            { name: 'EntityRowId', type: sql.Int, value: locationId }
        ];

        this.use(this.dbTypes.CASTLE).exec('Castle.spAddUserLogin', params, (err, data) => {
            if (err) {
                this.logError('Other', new Date(), err.message, 'Castle.spAddUserLogin', params);
            }
        });
    }

    /**
     * Impersonate any user... this could get ugly.
     *
     * @param {number} personRowId - The user requesting impersonation.
     * @param {number} impersonatedPersonRowId - The user to impersonate.
     * @param {Function} next - Function to execute once user is found.
     */
    impersonate(personRowId, impersonatedPersonRowId, next) {
        const params = [
            { name: 'PersonRowId', type: sql.Int, value: personRowId },
            { name: 'ImpersonatedPersonRowId', type: sql.Int, value: impersonatedPersonRowId }
        ];

        this.use(this.dbTypes.CASTLE).exec('Castle.spUserImpersonate', params, (err, user) => {
            if (!err) {
                next(null, user);
            } else {
                next(err, null);
            }
        });
    }

    /**
     * Converts response from MSSQL to a usable JS object.
     *
     * @param {*} data - The data from MSSQL.
     * @returns {Array|number|Date|boolean} - The usable JS object.
     */
    processResults(data) {
        if (!data) {
            return null;
        }

        if (data instanceof Array) {
            let temp = [];

            for (const item of data) {
                temp.push(this.processResults(item));
            }

            return temp;
        }

        if (data instanceof Object && !(data instanceof Array)) {
            for (const prop in data) {
                if (data.hasOwnProperty(prop)) {
                    data[prop] = this.processResults(data[prop]);
                }
            }

            return data;
        }

        // is it a boolean?
        if (/^true$|^false$/i.test(data)) {
            return data === 'true' || data === true;
        }

        // is it a number?
        if (!isNaN(+data) && !data.startsWith) {
            return +data;
        }

        // is it a date?
        // Ex. 2018-10-31T19:17:39.417Z
        if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(data)) {
            return moment(data).toDate();
        }

        // it's a string.
        return data;
    }

    mochaErrorCheck(res) {
        if (res.body) {
            if (res.body.message) {
                if (res.body.message.originalError) {
                    if (res.body.message.originalError.info) {
                        return res.body.message.originalError.info.message;
                    }
                } else {
                    return res.body.message;
                }
            } else if (res.body.error) {
                return res.body.error;
            }
        }

        return '';
    }

    /**
     * Checks if the user has specified roles.
     *
     * @param {*} req - The request data
     * @param {*} res - The response data
     * @param {number|number[]} roles - The roles to check
     * @returns {*} - The usable JS object.
     */
    hasRole(req, res, roles) {
        const user = JSON.parse(req.session.passport.user);

        if (+user.UserRoleRowId === this.roles.CASTLE_ADMIN) {
            return true;
        }

        if (roles instanceof Array) {
            for (let i = 0; i < roles.length; i++) {
                if (roles[i] === +user.UserRoleRowId) {
                    return true;
                }
            }
        } else if (!isNaN(+roles)) {
            if (roles === +user.UserRoleRowId) {
                return true;
            }
        }

        return res.status(403).json({ message: 'Nuh uh uh. You didn\'t say the magic word.' });
    }
}

module.exports = Helper;