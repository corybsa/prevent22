import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { map, catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
    constructor(
        private http: HttpClient
    ) { }

    login(username: string, password: string): Observable<any> {
        const url = '/api/auth/login';
        const options = {
            Username: username,
            Password: password
        };

        return this.http.post(url, options)
            .pipe(
                map(res => {
                    // TODO: update state
                    return res;
                })
            );
    }

    check() {
        const url = '/api/auth/check';

        return this.http.post(url, null)
            .pipe(
                map(res => res)
            );
    }

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
