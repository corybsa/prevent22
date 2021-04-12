import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { MessageService } from 'primeng/api';
import { combineLatest, Subscription } from 'rxjs';
import { Event } from 'src/app/models/event/event';
import { FlyoutStatus } from 'src/app/models/flyout/flyout-status';
import { Helper } from 'src/app/models/helper';
import { User } from 'src/app/models/user/user';
import { VolunteerService } from 'src/app/services/events/volunteer.service';
import { setEvents } from 'src/app/state/events/events.actions';
import { selectEvent } from 'src/app/state/events/events.selectors';
import { setFlyoutStatus } from 'src/app/state/flyout/flyout.actions';
import { selectCurrentUser } from 'src/app/state/user/user.selectors';

@Component({
  selector: 'app-cancel-volunteer-flyout',
  templateUrl: './cancel-volunteer-flyout.component.html',
  styleUrls: ['./cancel-volunteer-flyout.component.css']
})
export class CancelVolunteerFlyoutComponent implements OnInit, OnDestroy {
  subs: Subscription[] = [];
  model = { code: null };
  user: User;
  event: Event;

  constructor(
    private service: VolunteerService,
    private toast: MessageService,
    private store: Store
  ) {
    this.subs.push(
      combineLatest([
        this.store.select(selectEvent),
        this.store.select(selectCurrentUser)
      ]).subscribe(([event, user]) => {
        this.event = event;
        this.user = user;
      })
    );
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  submit(form: NgForm) {
    if(form.valid) {
      this.subs.push(
        this.service.cancelVolunteerByCode(+this.event.id, this.model.code).subscribe(
          events => {
            Helper.showSuccess(this.toast, 'Registration canceled!!');
            this.store.dispatch(setEvents({ events }));
            this.store.dispatch(setFlyoutStatus({ status: FlyoutStatus.Closed }));
          },
          err => Helper.showError(this.toast, err.error.message)
        )
      );
    }
  }
}
