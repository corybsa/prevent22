import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import * as moment from "moment";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { User } from "src/app/models/user/user";
import { Warning } from "src/app/models/warning/warning";
import { NetworkHelperService } from "../network-helper.service";

@Injectable()
export class UsersService {
    constructor(
        private http: HttpClient,
        private helper: NetworkHelperService
    ) { }

    getAll(): Observable<User[]> {
        const url = '/api/user';
        
        return this.http.get<User[]>(url).pipe(
            map(users => {
                return users.map(user => {
                    user.BannedUntil = moment(user.BannedUntil).toDate();
                    return user;
                });
            })
        );
    }

    getWarnings(UserId: number): Observable<Warning[]> {
        const url = '/api/user/warnings';
        const data = this.helper.getParams({ UserId });

        return this.http.get<Warning[]>(url, data);
    }

    update(
        UserId: number,
        RoleId: number,
        FirstName: string,
        LastName: string,
        Email: string,
        Country: string,
        State: string,
        City: string,
        ZipCode: string,
        Address: string,
        Phone: string,
        IsBanned: boolean,
        BannedUntil: Date,
        BannedById: number
    ): Observable<User> {
        const url = '/api/user';
        const data = {
            UserId,
            RoleId,
            FirstName,
            LastName,
            Email,
            Country,
            State,
            City,
            ZipCode,
            Address,
            Phone,
            IsBanned,
            BannedUntil,
            BannedById
        };

        return this.http.post<User>(url, data).pipe(
            map(user => {
                user.BannedUntil = moment(user.BannedUntil).toDate();
                return user;
            })
        );
    }
}
