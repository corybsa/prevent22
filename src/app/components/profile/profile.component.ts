import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest } from 'rxjs';
import { Helper } from 'src/app/models/helper';
import { Event } from 'src/app/models/event/event';
import { User } from 'src/app/models/user/user';
import { Warning } from 'src/app/models/warning/warning';
import { UsersService } from 'src/app/services/users/users.service';
import { selectUserEvents } from 'src/app/state/events/events.selectors';
import { selectCurrentUser } from 'src/app/state/user/user.selectors';
import { MessageService } from 'primeng/api';
import { NgForm } from '@angular/forms';
import { setCurrentUser } from 'src/app/state/user/user.actions';
import { setEvent, setUserEvents } from 'src/app/state/events/events.actions';
import { setFlyoutContent, setFlyoutStatus } from 'src/app/state/flyout/flyout.actions';
import { FlyoutContent } from 'src/app/models/flyout/flyout-content';
import { FlyoutStatus } from 'src/app/models/flyout/flyout-status';
import { take } from 'rxjs/operators';
import { SystemRoles } from 'src/app/models/user/system-roles';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: User;
  events: Event[];
  warnings: Warning[];

  warningsLoading = true;
  eventsLoading = true;
  rows = 10;
  rowsPerPageOptions = [10, 20, 50];
  
  roles = SystemRoles.toDropdownArray();

  constructor(
    private service: UsersService,
    private toast: MessageService,
    private store: Store
  ) {
    combineLatest([
      this.store.select(selectCurrentUser),
      this.store.select(selectUserEvents)
    ]).subscribe(
      ([user, events]) => {
        this.user = Helper.copy(user);
        this.events = events;
      },
      err => Helper.showError(this.toast, err.error.message)
    );

    this.store.select(selectCurrentUser).pipe(
      take(1)
    ).subscribe(
      user => {
        this.user = Helper.copy(user);
        this.getEvents();
        this.getWarnings();
      },
      err => Helper.showError(this.toast, err.error.message)
    )
  }

  ngOnInit(): void {
  }

  getEvents() {
    this.service.getEvents(this.user.UserId).subscribe(
      events => {
        this.store.dispatch(setUserEvents({ events }));
        this.eventsLoading = false;
      },
      err => Helper.showError(this.toast, err.error.message)
    )
  }

  getWarnings() {
    this.service.getWarnings(this.user.UserId).subscribe(
      warnings => {
        this.warnings = warnings;
        this.warningsLoading = false;
      },
      err => Helper.showError(this.toast, err.error.message)
    );
  }

  eventDetails(event: Event) {
    this.store.dispatch(setEvent({ event }));
    this.store.dispatch(setFlyoutContent({ title: 'Event details', content: FlyoutContent.Events.Edit, onClose: this.getEvents.bind(this) }));
    this.store.dispatch(setFlyoutStatus({ status: FlyoutStatus.Open }));
  }

  submit(form: NgForm) {
    if(form.valid) {
      this.service.update(
        this.user.UserId,
          this.user.RoleId,
          this.user.FirstName,
          this.user.LastName,
          this.user.Email,
          this.user.Country,
          this.user.State,
          this.user.City,
          this.user.ZipCode,
          this.user.Address,
          this.user.Phone,
          this.user.IsBanned,
          this.user.BannedUntil,
          this.user.BannedById
      ).subscribe(
        user => {
          this.store.dispatch(setCurrentUser({ user }));
          Helper.showSuccess(this.toast, 'Profile info updated!');
        },
        err => Helper.showError(this.toast, err.error.message)
      )
    }
  }

  changePage(e) {
    this.rows = e.rows;
  }
}
