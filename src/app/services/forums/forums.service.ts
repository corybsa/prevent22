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

    create(ForumName: string, ForumDescription: string): Observable<Forum[]> {
        const url = '/api/forum';
        const data = {
            BoardName: ForumName,
            BoardDescription: ForumDescription
        };

        return this.http.post<Forum[]>(url, data);
    }

    update(ForumId: number, ForumName: string, ForumDescription: string): Observable<Forum[]> {
        const url = '/api/forum';
        const data = {
            BoardId: ForumId,
            BoardName: ForumName,
            BoardDescription: ForumDescription
        };

        return this.http.put<Forum[]>(url, data);
    }

    delete(ForumId: number): Observable<Forum[]> {
        const url = '/api/forum';
        const data = this.helper.getParams({ BoardId: ForumId });

        return this.http.delete<Forum[]>(url, data);
    }
}
