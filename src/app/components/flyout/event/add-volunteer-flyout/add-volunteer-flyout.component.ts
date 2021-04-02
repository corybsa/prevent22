import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { MessageService } from 'primeng/api';
import { combineLatest, Subscription } from 'rxjs';
import { Event } from 'src/app/models/event/event';
import { FlyoutContent } from 'src/app/models/flyout/flyout-content';
import { FlyoutStatus } from 'src/app/models/flyout/flyout-status';
import { Helper } from 'src/app/models/helper';
import { User } from 'src/app/models/user/user';
import { Volunteer } from 'src/app/models/volunteer/volunteer';
import { VolunteerService } from 'src/app/services/events/volunteer.service';
import { setEvents } from 'src/app/state/events/events.actions';
import { selectEvent } from 'src/app/state/events/events.selectors';
import { setFlyoutContent, setFlyoutStatus } from 'src/app/state/flyout/flyout.actions';
import { selectUser } from 'src/app/state/user/user.selectors';

@Component({
  selector: 'app-add-volunteer-flyout',
  templateUrl: './add-volunteer-flyout.component.html',
  styleUrls: ['./add-volunteer-flyout.component.css']
})
export class AddVolunteerFlyoutComponent implements OnInit, OnDestroy {
  subs: Subscription[] = [];
  volunteer = new Volunteer();
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
        this.store.select(selectUser)
      ]).subscribe(([event, user]) => {
        this.event = Helper.copy(event);
        this.user = user;

        this.volunteer.FirstName = this.user?.FirstName;
        this.volunteer.LastName = this.user?.LastName;
        this.volunteer.Email = this.user?.Email;
      })
    );
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  submit() {
    this.subs.push(
      this.service.create(
        +this.event.id,
        this.user?.UserId,
        this.user?.FirstName ?? this.volunteer.FirstName,
        this.user?.LastName ?? this.volunteer.LastName,
        this.user?.Email ?? this.volunteer.Email
      ).subscribe(
        events => {
          Helper.showSuccess(this.toast, 'Volunteered for event!');
          this.store.dispatch(setEvents({ events }));
          this.store.dispatch(setFlyoutStatus({ status: FlyoutStatus.Closed }));
        },
        err => Helper.showError(this.toast, err.error.message)
      )
    )
  }

  cancelVolunteer() {
    if(this.user) {
      this.subs.push(
        this.service.cancelVolunteerByUserId(
          +this.event.id,
          this.user.UserId
        ).subscribe(
          events => {
            Helper.showSuccess(this.toast, 'Registration canceled!!');
            this.store.dispatch(setEvents({ events }));
            this.store.dispatch(setFlyoutStatus({ status: FlyoutStatus.Closed }));
          },
          err => Helper.showError(this.toast, err.error.message)
        )
      );
    } else {
      this.store.dispatch(setFlyoutContent({ title: 'Cancel volunteer', content: FlyoutContent.Events.Volunteer.Cancel }));
    }
  }
}
