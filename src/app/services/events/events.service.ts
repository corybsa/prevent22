import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Event } from "src/app/models/event/event";
import { NetworkHelperService } from "../network-helper.service";

@Injectable()
export class EventsService {
    constructor(
        private http: HttpClient,
        private helper: NetworkHelperService
    ) { }

    getAll(): Observable<Event[]> {
        const url = '/api/events/all';
        
        return this.http.get<Event[]>(url);
    }

    get(EventId: number): Observable<Event> {
        const url = '/api/events';
        const data = this.helper.getParams({ EventId });
        
        return this.http.get<Event>(url, data);
    }

    create(
        title: string,
        description: string,
        location: string,
        start: Date,
        end: Date,
        allDay: boolean,
        daysOfWeek: string,
        startTime: string,
        endTime: string,
        startRecur: Date,
        endRecur: Date,
        groupId: string
    ): Observable<Event[]> {
        const url = '/api/events';
        const data = {
            title,
            description,
            location,
            start,
            end,
            allDay,
            daysOfWeek,
            startTime,
            endTime,
            startRecur,
            endRecur,
            groupId
        };
        
        return this.http.post<Event[]>(url, data);
    }

    update(
        EventId: number,
        title: string,
        description: string,
        location: string,
        start: Date,
        end: Date,
        allDay: boolean,
        daysOfWeek: string,
        startTime: string,
        endTime: string,
        startRecur: Date,
        endRecur: Date,
        groupId: string
    ): Observable<Event[]> {
        const url = '/api/events';
        const data = {
            EventId,
            title,
            description,
            location,
            start,
            end,
            allDay,
            daysOfWeek,
            startTime,
            endTime,
            startRecur,
            endRecur,
            groupId
        };
        
        return this.http.put<Event[]>(url, data);
    }

    delete(EventId: number): Observable<Event[]> {
        const url = '/api/events';
        const data = this.helper.getParams({ EventId });
        
        return this.http.delete<Event[]>(url, data);
    }

    volunteer(
        EventId: number,
        UserId: number,
        FirstName: string,
        LastName: string,
        Email: string,
        Code: string
    ): Observable<Event[]> {
        const url = '/api/events/volunteer';
        const data = {
            EventId,
            UserId,
            FirstName,
            LastName,
            Email,
            Code
        };
        
        return this.http.post<Event[]>(url, data);
    }

    cancelVolunteer(VolunteerId: number): Observable<Event[]> {
        const url = '/api/events/volunteer';
        const data = this.helper.getParams({ VolunteerId });
        
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
