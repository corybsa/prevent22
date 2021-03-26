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

    get(ForumId: number): Observable<Thread[]> {
        const url = '/api/forum/threads';
        const data = this.helper.getParams({
            BoardId: ForumId
        });

        return this.http.get<Thread[]>(url, data);
    }
}
