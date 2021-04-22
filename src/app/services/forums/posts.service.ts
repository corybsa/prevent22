import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Post } from "src/app/models/post/post";
import { NetworkHelperService } from "../network-helper.service";

@Injectable()
export class PostsService {
    constructor(
        private http: HttpClient,
        private helper: NetworkHelperService
    ) {}

    getAll(ThreadId: number): Observable<Post[]> {
        const url = '/api/forum/posts';
        const data = this.helper.getParams({ ThreadId });

        return this.http.get<Post[]>(url, data);
    }

    create(
        Message: string,
        CreatedBy: number,
        ThreadId: number,
        CreatorIsAnonymous?: boolean,
        AnonymousEmail?: string,
        AnonymousCode?: string
    ): Observable<Post> {
        const url = '/api/forum/posts';
        const data = {
            Message,
            CreatedBy,
            ThreadId,
            CreatorIsAnonymous,
            AnonymousEmail,
            AnonymousCode
        };

        return this.http.post<Post>(url, data);
    }

    update(
        PostId: number,
        Message: string,
        CreatedBy: number,
        CreatedDate: Date,
        ThreadId: number
    ): Observable<Post[]> {
        const url = '/api/forum/posts';
        const data = {
            PostId,
            Message,
            CreatedBy,
            CreatedDate,
            ThreadId
        };

        return this.http.put<Post[]>(url, data);
    }

    delete(PostId: number): Observable<Post[]> {
        const url = '/api/forum/posts';
        const data = this.helper.getParams({ PostId });

        return this.http.delete<Post[]>(url, data);
    }
}
