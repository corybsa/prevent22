import * as _ from 'underscore';

export class Helper {
    /**
     * Creates a deep copy of <code>object</code>.
     *
     * @param object T
     * @returns {any} a copy of <code>object</code>.
     */
    static copy(object: any): any {
      if(object instanceof Array) {
        const target = [];
  
        for(const obj of object) {
          target.push(this.copy(obj));
        }
  
        return target;
      } else {
        const target = {};
  
        for(const prop in object) {
          if(object.hasOwnProperty(prop)) {
            target[prop] = object[prop];
          }
        }
  
        return target;
      }
    }
  
    /**
     * Compares two objects and returns <code>true</code> if they are equal, <code>false</code> if they are not equal.
     * @param src any: The source object.
     * @param target any: The object to compare.
     * @returns {any} <code>true</code> if they are equal, <code>false</code> if they are not equal.
     */
    static compare(src: any, target: any) {
      return _.isEqual(src, target);
    }
  
    static isMobile() {
      return navigator.userAgent.match(/Android|iPhone|iPad|iPod/i) !== null;
    }
  }
  