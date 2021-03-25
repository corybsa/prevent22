import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Forum } from "src/app/models/forum/forum";
import { NetworkHelperService } from "../network-helper.service";

@Injectable()
export class ForumsService {
    constructor(
        private http: HttpClient,
        private helper: NetworkHelperService
    ) {}

    getAll(): Observable<Forum[]> {
        const url = '/api/forum';

        return this.http.get<Forum[]>(url);
    }

    create(BoardName: string, BoardDescription: string): Observable<Forum[]> {
        const url = '/api/forum';
        const data = {
            BoardName,
            BoardDescription
        };

        return this.http.post<Forum[]>(url, data);
    }

    delete(BoardId: number): Observable<Forum[]> {
        const url = '/api/forum';
        const data = this.helper.getParams({ BoardId });

        return this.http.delete<Forum[]>(url, data);
    }
}
