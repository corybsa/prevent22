import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Warning } from "src/app/models/warning/warning";
import { NetworkHelperService } from "../network-helper.service";

@Injectable()
export class WarningsService {
    constructor(
        private http: HttpClient,
        private helper: NetworkHelperService
    ) { }

    getAll(): Observable<Warning[]> {
        const url = '/api/warning/all';

        return this.http.get<Warning[]>(url);
    }

    get(WarningId: number): Observable<Warning> {
        const url = '/api/warning';
        const data = this.helper.getParams({
            WarningId
        });

        return this.http.get<Warning>(url, data);
    }

    create(
        WarningReason: string,
        UserId: number,
        CreatedById: number,
        PostId: number,
        ShouldBanUser: boolean,
        BanUntil: Date
    ): Observable<Warning[]> {
        const url = '/api/warning';
        const data = {
            WarningReason,
            UserId,
            CreatedById,
            PostId,
            ShouldBanUser,
            BanUntil
        };

        return this.http.post<Warning[]>(url, data);
    }

    update(
        WarningId: number,
        WarningReason: string,
        WarningDate: Date,
        UserId: number,
        CreatedById: number,
        PostId: number
    ): Observable<Warning[]> {
        const url = '/api/warning';
        const data = {
            WarningId,
            WarningReason,
            WarningDate,
            UserId,
            CreatedById,
            PostId
        };

        return this.http.put<Warning[]>(url, data);
    }

    delete(WarningId: number): Observable<Warning[]> {
        const url = '/api/warning';
        const data = this.helper.getParams({
            WarningId
        });

        return this.http.delete<Warning[]>(url, data);
    }
}
