import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { Event } from 'src/app/models/event/event';
import { FlyoutStatus } from 'src/app/models/flyout/flyout-status';
import { Helper } from 'src/app/models/helper';
import { EventsService } from 'src/app/services/events/events.service';
import { setEvents } from 'src/app/state/events/events.actions';
import { selectEvent } from 'src/app/state/events/events.selectors';
import { setFlyoutStatus } from 'src/app/state/flyout/flyout.actions';

@Component({
  selector: 'app-add-event-flyout',
  templateUrl: './add-event-flyout.component.html',
  styleUrls: ['./add-event-flyout.component.css']
})
export class AddEventFlyoutComponent implements OnInit, OnDestroy {
  subs: Subscription[] = [];
  event = new Event();
  helper = Helper;

  showTitleMessage = false;
  showStartMessage = false;
  showEndMessage = false;

  constructor(
    private service: EventsService,
    private toast: MessageService,
    private store: Store
  ) {
    this.store.select(selectEvent).subscribe(event => this.event = Helper.copy(event));
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
      this.service.create(
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
          Helper.showSuccess(this.toast, 'Event created!');
          this.store.dispatch(setEvents({ events }));
          this.store.dispatch(setFlyoutStatus({ status: FlyoutStatus.Closed }));
        },
        err => Helper.showError(this.toast, err.error.message)
      )
    );
  }
}
