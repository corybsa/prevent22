import * as moment from 'moment';

/**
 * @static DATE: String to format a <code>moment</code> object. value is 'YYYY-MM-DD'
 * @static TIME: String to format a <code>moment</code> object. value is 'HH:mm:ss'
 * @static DATETIME: String to format a <code>moment</code> object. value is 'YYYY-MM-DD HH:mm:ss'
 * @static HUMAN_DATE: String to format a <code>moment</code> object. value is 'MM/DD/YY'
 * @static HUMAN_DATETIME: String to format a <code>moment</code> object. value is 'MM/DD/YY h:mm:ss a'
 * @static HUMAN_SHORTDATE: String to format a <code>moment</code> object. value is 'DD MMM'
 * @static HUMAN_DATETIME_NO_SECONDS: String to format a <code>moment</code> object. value is 'MM/DD/YYYY h:mm a'
 * @static HUMAN_TIME: String to format a <code>moment</code> object. value is 'h:mm:ss a'
 * @static HUMAN_TIME_NO_SECONDS: String to format a <code>moment</code> object. value is 'h:mm a'
 */
export class Formatter {
  /**
   * @static
   * @readonly
   */
  static readonly DATE = 'YYYY-MM-DD';

  /**
   * @static
   * @readonly
   */
  static readonly TIME = 'HH:mm:ss';

  /**
   * @static
   * @readonly
   */
  static readonly DATETIME = 'YYYY-MM-DD HH:mm:ss';

  /**
   * @static
   * @readonly
   */
  static readonly HUMAN_DATE = 'MM/DD/YY';

  /**
   * @static
   * @readonly
   */
  static readonly HUMAN_DATETIME = 'MM/DD/YY hh:mm:ss a';

  /**
   * @static
   * @readonly
   */
  static readonly HUMAN_SHORTDATE = 'DD MMM';

  /**
   * @static
   * @readonly
   */
  static readonly HUMAN_DATETIME_NO_SECONDS = 'MM/DD/YYYY hh:mm a';

  /**
   * @static
   * @readonly
   */
  static readonly HUMAN_TIME = 'hh:mm:ss a';

  /**
   * @static
   * @readonly
   */
  static readonly HUMAN_TIME_NO_SECONDS = 'hh:mm a';

  /**
   * @param {Date} date The date to format.
   * @param {string} format The string to specify the format of the date. Refer to <a href="http://momentjs.com/docs/#/displaying/format/">momentjs.com</a>.
   * @returns {string} The date formatted based on the <code>format</code> parameter.
   */
  static format(date: Date, format: string) {
    return moment(date).format(format);
  }

  /**
   * @param {Date} date The date to format.
   * @returns {string} The <code>date</code> formatted as {@link Formatter.DATE}.
   */
  static getDbDate(date: Date): string {
    return Formatter.format(date, this.DATE);
  }

  /**
   * @param {Date} date The date to format.
   * @returns {string} The <code>date</code> formatted as {@link Formatter.TIME}.
   */
  static getDbTime(date: Date): string {
    return Formatter.format(date, this.TIME);
  }

  /**
   * @param {Date} date The date to format.
   * @returns {string} The <code>date</code> formatted as {@link Formatter.DATETIME}.
   */
  static getDbDateTime(date: Date): string {
    return Formatter.format(date, this.DATETIME);
  }

  /**
   * @param {Date} date The date to format.
   * @returns {string} The <code>date</code> formatted as {@link Formatter.HUMAN_DATE}.
   */
  static getHumanDate(date: Date): string {
    return Formatter.format(date, this.HUMAN_DATE);
  }

  /**
   * @param {Date} date The date to format.
   * @returns {string} The <code>date</code> formatted as {@link Formatter.HUMAN_SHORTDATE}.
   */
  static getHumanShortDate(date: Date): string {
    return Formatter.format(date, this.HUMAN_SHORTDATE);
  }

  /**
   * @param {Date} date The date to format.
   * @returns {string} The <code>date</code> formatted as {@link Formatter.HUMAN_DATETIME}.
   */
  static getHumanDateTime(date: Date): string {
    return Formatter.format(date, this.HUMAN_DATETIME);
  }

  /**
   * @param {Date} date The date to format.
   * @returns {string} The <code>date</code> formatted as {@link Formatter.HUMAN_DATETIME_NO_SECONDS}.
   */
  static getHumanDateTimeNoSeconds(date: Date): string {
    return Formatter.format(date, this.HUMAN_DATETIME_NO_SECONDS);
  }

  /**
   * @param {Date} date The date to format.
   * @returns {string} The <code>date</code> formatted as {@link Formatter.HUMAN_TIME}.
   */
  static getHumanTime(date: Date): string {
    return Formatter.format(date, this.HUMAN_TIME);
  }

  /**
   * @param {Date} date The date to format.
   * @returns {string} The <code>date</code> formatted as {@link Formatter.HUMAN_TIME_NO_SECONDS}.
   */
  static getHumanTimeNoSeconds(date: Date): string {
    return Formatter.format(date, this.HUMAN_TIME_NO_SECONDS);
  }

  static getElapsedTime(date: Date): string {
    const diff = moment(date).diff(new Date());
    return moment.duration(diff, 'milliseconds').humanize(true);
  }
}
