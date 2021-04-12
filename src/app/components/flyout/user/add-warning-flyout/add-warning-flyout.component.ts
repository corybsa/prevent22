import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { MessageService } from 'primeng/api';
import { combineLatest, Subscription } from 'rxjs';
import { FlyoutStatus } from 'src/app/models/flyout/flyout-status';
import { Helper } from 'src/app/models/helper';
import { Post } from 'src/app/models/post/post';
import { User } from 'src/app/models/user/user';
import { Warning } from 'src/app/models/warning/warning';
import { UsersService } from 'src/app/services/users/users.service';
import { WarningsService } from 'src/app/services/warnings/warnings.service';
import { setFlyoutStatus } from 'src/app/state/flyout/flyout.actions';
import { selectPost } from 'src/app/state/posts/posts.selectors';
import { selectCurrentUser } from 'src/app/state/user/user.selectors';

@Component({
  selector: 'app-add-warning-flyout',
  templateUrl: './add-warning-flyout.component.html',
  styleUrls: ['./add-warning-flyout.component.css']
})
export class AddWarningFlyoutComponent implements OnInit, OnDestroy {
  subs: Subscription[] = [];
  warning = new Warning();
  userWarnings: Warning[];
  post: Post;
  user: User;
  today = new Date();
  helper = Helper;

  constructor(
    private warningService: WarningsService,
    private userService: UsersService,
    private toast: MessageService,
    private store: Store
  ) {
    this.subs.push(
      combineLatest([
        this.store.select(selectPost),
        this.store.select(selectCurrentUser)
      ]).subscribe(([post, user]) => {
        this.post = post;
        this.user = user;

        this.getUserWarnings(post.CreatedBy);
      })
    );
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  getUserWarnings(userId: number) {
    this.subs.push(
      this.userService.getWarnings(userId).subscribe(
        warnings => this.userWarnings = warnings,
        err => Helper.showError(this.toast, err.error.message)
      )
    );
  }

  submit(form: NgForm) {
    if(form.valid) {
      this.subs.push(
        this.warningService.create(
          this.warning.WarningReason,
          this.post.CreatedBy,
          this.user.UserId,
          this.post.PostId,
          !!this.warning.ShouldBanUser,
          this.warning.BanUntil
        ).subscribe(
          warnings => {
            Helper.showSuccess(this.toast, 'Warning issued!');
            this.store.dispatch(setFlyoutStatus({ status: FlyoutStatus.Closed }));
          },
          err => Helper.showError(this.toast, err.error.message)
        )
      );
    }
  }
}
