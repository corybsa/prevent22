import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import { combineLatest, Subscription } from 'rxjs';
import { FlyoutStatus } from 'src/app/models/flyout/flyout-status';
import { Helper } from 'src/app/models/helper';
import { SystemRoles } from 'src/app/models/user/system-roles';
import { User } from 'src/app/models/user/user';
import { UsersService } from 'src/app/services/users/users.service';
import { setFlyoutStatus } from 'src/app/state/flyout/flyout.actions';
import { selectCurrentUser, selectUser } from 'src/app/state/user/user.selectors';

@Component({
  selector: 'app-edit-user-flyout',
  templateUrl: './edit-user-flyout.component.html',
  styleUrls: ['./edit-user-flyout.component.css']
})
export class EditUserFlyoutComponent implements OnInit, OnDestroy {
  subs: Subscription[] = [];
  user: User;
  currentUser: User;
  roles = SystemRoles.toDropdownArray();
  isMobile = Helper.isMobile();
  today = new Date();
  initialBanValue: boolean;

  constructor(
    private userService: UsersService,
    private toast: MessageService,
    private store: Store
  ) {
    this.subs.push(
      combineLatest([
        this.store.select(selectUser),
        this.store.select(selectCurrentUser)
      ]).subscribe(
        ([user, currentUser]) => {
          this.initialBanValue = user.IsBanned;
          this.user = Helper.copy(user);
          this.user.BannedUntil = moment(this.user.BannedUntil).toDate();
          this.currentUser = currentUser;
        },
        err => Helper.showError(this.toast, err.error.message)
      )
    );
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  checkBan(toBeBanned) {
    // only do this if the user wasn't banned before the flyout was opened.
    // this is to handle the case where someone is clicking the checkbox over and over
    if(toBeBanned && !this.initialBanValue) {
      this.user.BannedById = this.currentUser.UserId;
    }
  }

  submit(form: NgForm) {
    if(form.valid) {
      const offset = moment(new Date()).utcOffset();

      this.subs.push(
        this.userService.update(
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
          !!this.user.IsBanned,
          !!this.user.IsBanned ? moment(this.user.BannedUntil).subtract(offset, 'minutes').toDate() : null,
          (!!this.user.IsBanned || this.user.BannedById) ? this.user.BannedById : null
        ).subscribe(
          user => {
            Helper.showSuccess(this.toast, 'User info updated!');
            this.store.dispatch(setFlyoutStatus({ status: FlyoutStatus.Closed }));
          },
          err => Helper.showError(this.toast, err.error.message)
        )
      );
    }
  }
}
