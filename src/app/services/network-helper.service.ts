import { HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class NetworkHelperService {
    constructor() { }

    getParams(data: any): { params: HttpParams } {
        if (typeof data !== 'object') {
            throw new Error('Data must be an object');
        }

        let params = new HttpParams();

        for (const prop in data) {
            if (data.hasOwnProperty(prop)) {
                if (data[prop] !== undefined && data[prop] !== null) {
                    params = params.set(prop, data[prop].toString());
                }
            }
        }

        return { params };
    }
}
