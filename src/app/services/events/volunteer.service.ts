import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { NetworkHelperService } from "../network-helper.service";
import { Event } from "src/app/models/event/event";
import { Volunteer } from "src/app/models/volunteer/volunteer";

@Injectable()
export class VolunteerService {
    constructor(
        private http: HttpClient,
        private helper: NetworkHelperService
    ) { }

    get(UserId: number): Observable<Volunteer[]> {
        const url = '/api/events/volunteer';
        const data = this.helper.getParams({ UserId });

        return this.http.get<Volunteer[]>(url, data);
    }

    create(
        EventId: number,
        UserId: number,
        FirstName: string,
        LastName: string,
        Email: string
    ): Observable<Event> {
        const url = '/api/events/volunteer';
        const data = {
            EventId,
            UserId,
            FirstName,
            LastName,
            Email
        };
        
        return this.http.post<Event>(url, data);
    }

    cancelVolunteer(VolunteerId: number): Observable<Event[]> {
        const url = '/api/events/volunteer';
        const data = this.helper.getParams({ VolunteerId });
        
        return this.http.delete<Event[]>(url, data);
    }

    cancelVolunteerByUserId(
        EventId: number,
        UserId: number
    ): Observable<Event[]> {
        const url = '/api/events/volunteer/user';
        const data = this.helper.getParams({
            EventId,
            UserId
        });
        
        return this.http.delete<Event[]>(url, data);
    }

    cancelVolunteerByCode(
        EventId: number,
        Code: string
    ): Observable<Event[]> {
        const url = '/api/events/volunteer/code';
        const data = this.helper.getParams({
            EventId,
            Code
        });
        
        return this.http.delete<Event[]>(url, data);
    }
}
