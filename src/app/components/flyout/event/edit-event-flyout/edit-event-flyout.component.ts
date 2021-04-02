import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import { combineLatest, Subscription } from 'rxjs';
import { FlyoutContent } from 'src/app/models/flyout/flyout-content';
import { FlyoutStatus } from 'src/app/models/flyout/flyout-status';
import { Helper } from 'src/app/models/helper';
import { User } from 'src/app/models/user/user';
import { EventsService } from 'src/app/services/events/events.service';
import { setEvents } from 'src/app/state/events/events.actions';
import { selectEvent } from 'src/app/state/events/events.selectors';
import { setFlyoutContent, setFlyoutStatus } from 'src/app/state/flyout/flyout.actions';
import { selectUser } from 'src/app/state/user/user.selectors';
import { Event } from '../../../../models/event/event';

@Component({
  selector: 'app-edit-event-flyout',
  templateUrl: './edit-event-flyout.component.html',
  styleUrls: ['./edit-event-flyout.component.css']
})
export class EditEventFlyoutComponent implements OnInit, OnDestroy {
  subs: Subscription[] = [];
  event = new Event();
  user: User;
  helper = Helper;

  showTitleMessage = false;
  showStartMessage = false;
  showEndMessage = false;

  constructor(
    private service: EventsService,
    private toast: MessageService,
    private store: Store
  ) {
    this.subs.push(
      combineLatest([
        this.store.select(selectEvent),
        this.store.select(selectUser)
      ]).subscribe(([event, user]) => {
        this.event = Helper.copy(event);
        this.user = user;
      })
    );
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  submit() {
    this.showTitleMessage = false;
    this.showStartMessage = false;
    this.showEndMessage = false;

    if (!this.event.title) {
      this.showTitleMessage = true;
    }

    if (!this.event.start) {
      this.showStartMessage = true;
    }

    if (!this.event.end) {
      this.showEndMessage = true;
    }

    if (this.showTitleMessage || this.showStartMessage || this.showEndMessage) {
      return;
    }

    const offset = moment(new Date()).utcOffset();

    this.subs.push(
      this.service.update(
        +this.event.id,
        this.event.title,
        this.event.description,
        this.event.location,
        moment(this.event.start).subtract(offset, 'minutes').toDate(),
        moment(this.event.end).subtract(offset, 'minutes').toDate(),
        !!this.event.allDay,
        this.event.daysOfWeek?.toString(),
        this.event.startTime,
        this.event.endTime,
        this.event.startRecur,
        this.event.endRecur,
        this.event.groupId
      ).subscribe(
        events => {
          Helper.showSuccess(this.toast, 'Event updated!');
          this.store.dispatch(setEvents({ events }));
          this.store.dispatch(setFlyoutStatus({ status: FlyoutStatus.Closed }));
        },
        err => Helper.showError(this.toast, err.error.message)
      )
    );
  }

  deleteEvent() {
    this.subs.push(
      this.service.delete(+this.event.id).subscribe(
        events => {
          Helper.showSuccess(this.toast, 'Event deleted!');
          this.store.dispatch(setEvents({ events }));
          this.store.dispatch(setFlyoutStatus({ status: FlyoutStatus.Closed }));
        },
        err => Helper.showError(this.toast, err.error.message)
      )
    );
  }

  volunteer() {
    this.store.dispatch(setFlyoutContent({ title: `Volunteer for ${this.event.title}`, content: FlyoutContent.Events.Volunteer.Add }));
  }
}
