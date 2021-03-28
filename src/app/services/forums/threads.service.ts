import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Thread } from "src/app/models/thread/thread";
import { NetworkHelperService } from "../network-helper.service";

@Injectable()
export class ThreadsService {
    constructor(
        private http: HttpClient,
        private helper: NetworkHelperService
    ) {}

    getAll(ForumId: number): Observable<Thread[]> {
        const url = '/api/forum/threads';
        const data = this.helper.getParams({
            BoardId: ForumId
        });

        return this.http.get<Thread[]>(url, data);
    }

    create(ForumId: number, ThreadName: string, CreatedBy: number): Observable<Thread> {
        const url = '/api/forum/threads';
        const data = {
            BoardId: ForumId,
            ThreadName,
            CreatedBy
        };

        return this.http.post<Thread>(url, data);
    }

    update(
        ThreadId: number,
        ForumId: number,
        ThreadName: string,
        CreatedBy: number,
        CreatedDate: Date,
        IsClosed: boolean
    ): Observable<Thread[]> {
        const url = '/api/forum/threads';
        const data = {
            BoardId: ForumId,
            ThreadId,
            ThreadName,
            CreatedBy,
            CreatedDate,
            IsClosed
        };

        return this.http.put<Thread[]>(url, data);
    }

    delete(ThreadId: number): Observable<Thread[]> {
        const url = '/api/forum/threads';
        const data = this.helper.getParams({ ThreadId });

        return this.http.delete<Thread[]>(url, data);
    }
}
