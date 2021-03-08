import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { select, Store } from "@ngrx/store";
import { selectUser } from "src/app/state/user/user.selectors";
import { User } from "src/app/models/user/user";

@Injectable({ providedIn: 'root' })
export class AuthService {
    constructor(
        private http: HttpClient,
        private store: Store
    ) { }

    login(username: string, password: string): Observable<any> {
        const url = '/api/auth/login';
        const options = {
            Username: username,
            Password: password
        };

        return this.http.post<User>(url, options);
    }

    check(): Observable<User> {
        const url = '/api/auth/check';
        let user;
        this.store.pipe(select(selectUser)).subscribe(res => user = res);

        if(user) {
            return new Observable(o => {
                o.next(user);
                o.complete();
            });
        }

        return this.http.post<User>(url, null);
    }

    logout() {
        const url = '/api/auth/logout';
        return this.http.post(url, null);
    }

    register(
        username: string,
        password: string,
        confirmPassword: string
    ): Observable<User> {
        const url = '/api/auth/register';
        const options = {
            username,
            password,
            confirmPassword
        };

        return this.http.post<User>(url, options);
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
