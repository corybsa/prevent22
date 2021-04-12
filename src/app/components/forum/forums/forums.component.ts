import { Component, OnInit } from '@angular/core';
import { combineLatest } from 'rxjs';
import { Forum } from 'src/app/models/forum/forum';
import { ForumsService } from 'src/app/services/forums/forums.service';
import { Formatter } from 'src/app/models/formatter';
import { User } from 'src/app/models/user/user';
import { Store } from '@ngrx/store';
import { selectCurrentUser } from 'src/app/state/user/user.selectors';
import { SystemRoles } from 'src/app/models/user/system-roles';
import { setFlyoutContent, setFlyoutStatus } from 'src/app/state/flyout/flyout.actions';
import { FlyoutStatus } from 'src/app/models/flyout/flyout-status';
import { FlyoutContent } from 'src/app/models/flyout/flyout-content';
import { selectAllForums } from 'src/app/state/forums/forums.selectors';
import { first } from 'rxjs/operators';
import { setAllForums, setForum } from 'src/app/state/forums/forums.actions';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { Helper } from 'src/app/models/helper';

@Component({
  selector: 'app-forums',
  templateUrl: './forums.component.html',
  styleUrls: ['./forums.component.css']
})
export class ForumsComponent implements OnInit {
  forums: Forum[];
  user: User;
  systemRoles = SystemRoles;

  loading = true;
  rows = 10;

  constructor(
    private forumService: ForumsService,
    private store: Store,
    private toast: MessageService,
    private router: Router
  ) {
    combineLatest([
      this.store.select(selectCurrentUser),
      this.store.select(selectAllForums)
    ]).subscribe(([user, forums]) => {
      this.user = user;
      this.forums = forums;

      this.loading = false;
    });

    this.forumService
      .getAll()
      .pipe(first())
      .subscribe(
        forums => this.store.dispatch(setAllForums({ forums })),
        err => Helper.showError(this.toast, err.error.message)
      );
  }

  ngOnInit(): void {
    
  }

  createForum() {
    this.store.dispatch(setFlyoutStatus({ status: FlyoutStatus.Open }));
    this.store.dispatch(setFlyoutContent({ title: 'Create forum', content: FlyoutContent.Forums.Add }));
  }

  getPostDate(forum: Forum) {
    return Formatter.getHumanDateTimeNoSeconds(forum.LastPostDate);
  }

  editForum(forum: Forum) {
    this.store.dispatch(setForum({ forum }));
    this.store.dispatch(setFlyoutContent({ title: `Edit ${forum.BoardName}`, content: FlyoutContent.Forums.Edit }));
    this.store.dispatch(setFlyoutStatus({ status: FlyoutStatus.Open }));
  }

  deleteForum(forumId: number) {
    this.forumService
      .delete(forumId)
      .pipe(first())
      .subscribe(
        forums => {
          Helper.showSuccess(this.toast, 'Forum deleted!');
          this.store.dispatch(setAllForums({ forums }));
        },
        err => Helper.showError(this.toast, err.error.message)
      );
  }

  openThreads(forum: Forum) {
    this.store.dispatch(setForum({ forum }));
    this.router.navigate(['/forums', forum.BoardId, 'threads']);
  }

  changePage(e) {
    this.rows = e.rows;
  }
}
