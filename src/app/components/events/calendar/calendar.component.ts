import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Event } from 'src/app/models/event/event';
import { CalendarOptions, FullCalendarComponent } from '@fullcalendar/angular';
import { User } from 'src/app/models/user/user';
import { Store } from '@ngrx/store';
import { selectUser } from 'src/app/state/user/user.selectors';
import { combineLatest } from 'rxjs';
import { selectEvents } from 'src/app/state/events/events.selectors';
import { setEvent, setEvents } from 'src/app/state/events/events.actions';
import { setFlyoutContent, setFlyoutStatus } from 'src/app/state/flyout/flyout.actions';
import { FlyoutContent } from 'src/app/models/flyout/flyout-content';
import { FlyoutStatus } from 'src/app/models/flyout/flyout-status';
import { EventsService } from 'src/app/services/events/events.service';
import * as moment from 'moment';
import { Helper } from 'src/app/models/helper';
import { SystemRoles } from 'src/app/models/user/system-roles';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit, AfterViewInit {
  events: Event[] = [];
  options: CalendarOptions;
  user: User;

  @ViewChild('calendar') calendar: FullCalendarComponent;

  constructor(
    private service: EventsService,
    private store: Store
  ) {
    let initialView = 'dayGridMonth';

    if(window.innerWidth < 768) {
      initialView = 'listWeek';
    }

    this.options = {
      timeZone: 'local',
      themeSystem: 'bootstrap',
      initialView: initialView,
      initialDate: new Date(),
      dayMaxEvents: true,
      height: window.innerHeight - 106,
      events: this.events,
      headerToolbar: {
        start: 'prev,next today',
        center: 'title',
        end: 'dayGridMonth,listWeek'
      },
      editable: false,
      eventResizableFromStart: false,
      windowResize: this.resizeWindow.bind(this),
      dateClick: this.addEvent.bind(this),
      eventClick: this.editEvent.bind(this),
      eventResize: this.resizeEvent.bind(this),
      eventDrop: this.moveEvent.bind(this)
    };
  }

  ngOnInit(): void {
    this.service.getAll().subscribe(events => this.store.dispatch(setEvents({ events })));
  }

  ngAfterViewInit() {
    combineLatest([
      this.store.select(selectUser),
      this.store.select(selectEvents)
    ]).subscribe(([user, events]) => {
      this.user = user;
      this.events = events;
      this.options.events = this.events;
      this.options.editable = this.user?.hasRole(SystemRoles.Admin);
      this.options.eventResizableFromStart = this.user?.hasRole(SystemRoles.Admin);
    });
  }

  resizeWindow() {
    this.options.height = window.innerHeight - 106;
  }

  addEvent(e) {
    if(!this.user?.hasRole(SystemRoles.Admin)) {
      return;
    }

    const event = new Event();
    event.start = e.date;
    event.end = e.date;
    this.store.dispatch(setEvent({ event }));
    this.store.dispatch(setFlyoutContent({ title: 'Create event', content: FlyoutContent.Events.Add }));
    this.store.dispatch(setFlyoutStatus({ status: FlyoutStatus.Open }));
  }

  editEvent(e) {
    const event = new Event();
    event.id = e.event.id;
    event.allDay = e.event.allDay;
    event.start = e.event.start;
    event.end = e.event.end ? e.event.end : e.event.start;
    event.title = e.event.title;
    event.description = e.event.extendedProps.description;
    event.location = e.event.extendedProps.location;
    event.daysOfWeek = e.event._def.recurringDef?.typeData.daysOfWeek;
    event.startTime = e.event._def.recurringDef?.typeData.startTime;
    event.endTime = e.event._def.recurringDef?.typeData.endTime;
    event.startRecur = e.event._def.recurringDef?.typeData.startRecur;
    event.endRecur = e.event._def.recurringDef?.typeData.endRecur;
    event.groupId = e.event.groupId;

    let title;

    if(this.user?.hasRole(SystemRoles.Admin)) {
      title = `Update ${e.event.title}`;
    } else {
      title = `Info for ${e.event.title}`;
    }

    this.store.dispatch(setEvent({ event }));
    this.store.dispatch(setFlyoutContent({ title, content: FlyoutContent.Events.Edit }));
    this.store.dispatch(setFlyoutStatus({ status: FlyoutStatus.Open }));
  }

  resizeEvent(e) {
    if(!this.user?.hasRole(SystemRoles.Admin)) {
      return;
    }

    console.log(e);
  }

  moveEvent(e) {
    if(!this.user?.hasRole(SystemRoles.Admin)) {
      return;
    }

    console.log(e);
  }
}
