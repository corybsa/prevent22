import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { select, Store } from "@ngrx/store";
import { selectCurrentUser } from "src/app/state/user/user.selectors";
import { User } from "src/app/models/user/user";
import { map } from "rxjs/operators";
import * as moment from "moment";

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

        return this.http.post<User>(url, options).pipe(
            map(user => {
                user.BannedUntil = moment(user.BannedUntil).toDate();
                return user;
            })
        );
    }

    check(): Observable<User> {
        const url = '/api/auth/check';
        let user: User;
        this.store.pipe(select(selectCurrentUser)).subscribe(res => user = res);

        if(user) {
            return new Observable(o => {
                o.next(user);
                o.complete();
            });
        }

        return this.http.post<User>(url, null).pipe(
            map(user => {
                user.BannedUntil = moment(user.BannedUntil).toDate();
                return user;
            })
        );
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

        return this.http.post<User>(url, options).pipe(
            map(user => {
                user.BannedUntil = moment(user.BannedUntil).toDate();
                return user;
            })
        );
    }
}
