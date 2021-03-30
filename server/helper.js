const sql = require('mssql');
const moment = require('moment');
const config = require('../server/config/config');
// const multer = require('multer');
// const crypto = require('crypto');
const bcrypt = require('bcryptjs');
// const fs = require('fs');

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
            Admin: 1,
            Moderator: 2,
            User: 3
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
                        this.logRequest(procedure, params, true);
                        this.logError(procedure, params, err.originalError.info.message);
                    }

                    // close connection.
                    pool.close();

                    // return err and result info to client.
                    next(err ? err.originalError.info : null, result);
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
                    case sql.NVarChar:
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

    logError(procedure, params, message) {
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
                    case sql.NVarChar:
                        paramsLog[i] = `\'${paramsLog[i]}\'`;
                        break;
                }
            }

            exec = `${message}\nEXEC ${procedure} ${paramsLog.join(', ')}`;
        } else {
            exec = `${message}\nEXEC ${procedure}`;
        }

        this.logMessage(exec, this.RED_TEXT);
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
        bcrypt.hash(password, config.crypto.rounds, callback);
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
            return sql.NVarChar;
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

        return sql.NVarChar;
    }

    /**
     * Get all parameters formatted to send to SQL.
     *
     * @param {*} req - The request from the client.
     * @param {boolean} needsToBeLoggedIn - Check if the user needs to be logged in
     * @param {number} statementType - Which StatementType to use.
     * @returns {*} The formatted parameters or null if there are no parameters.
     */
    getParameters(req, needsToBeLoggedIn, statementType) {
        const params = [];

        if (needsToBeLoggedIn && !req.session.passport) {
            // if we don't clear the parameters between calls they will just keep appending to this array.
            this.params = [];

            throw new Error('Not logged in.');
        }

        if (!statementType) {
            throw new Error('StatementType not found');
        }

        params.push({ name: 'StatementType', type: sql.Int, value: statementType });

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
            case sql.NVarChar:
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

        this.params.push({ name: param, dataType: sql.NVarChar, value: params[param] });
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

        this.params.push({ name: param, dataType: sql.NVarChar, value: params[param] });
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
        const params = this.getParameter(req, param, isRequired, sql.NVarChar);

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

        this.params.push({ name: param, dataType: sql.NVarChar, value: params[param] });
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
    hasRole(req, roles) {
        const user = req.session.passport.user;

        if (+user.RoleId === this.roles.Admin) {
            return true;
        }

        if (roles instanceof Array) {
            for (let i = 0; i < roles.length; i++) {
                console.log(roles[i], user.RoleId);
                if (roles[i] === +user.RoleId) {
                    return true;
                }
            }
        } else if (!isNaN(+roles)) {
            if (roles === +user.RoleId) {
                return true;
            }
        }

        return false;
    }
}

module.exports = Helper;
