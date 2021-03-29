import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Warning } from "src/app/models/warning/warning";
import { NetworkHelperService } from "../network-helper.service";

@Injectable()
export class UsersService {
    constructor(
        private http: HttpClient,
        private helper: NetworkHelperService
    ) { }

    getWarnings(UserId: number): Observable<Warning[]> {
        const url = '/api/user/warnings';
        const data = this.helper.getParams({ UserId });

        return this.http.get<Warning[]>(url, data);
    }
}
