import { Component, OnInit } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { Forum } from 'src/app/models/forum/forum';
import { ForumsService } from 'src/app/services/forums/forums.service';
import { Formatter } from 'src/app/models/formatter';
import { User } from 'src/app/models/user/user';
import { Store } from '@ngrx/store';
import { selectUser } from 'src/app/state/user/user.selectors';
import { SystemRoles } from 'src/app/models/user/system-roles';
import { setFlyoutContent, setFlyoutStatus } from 'src/app/state/flyout/flyout.actions';
import { FlyoutStatus } from 'src/app/models/flyout/flyout-status';
import { FlyoutContent } from 'src/app/models/flyout/flyout-content';
import { selectAllForums } from 'src/app/state/forums/forums.selectors';
import { first } from 'rxjs/operators';
import { setAllForums, setForum } from 'src/app/state/forums/forums.actions';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forums',
  templateUrl: './forums.component.html',
  styleUrls: ['./forums.component.css']
})
export class ForumsComponent implements OnInit {
  forums: Forum[];
  user: User;
  systemRoles = SystemRoles;

  constructor(
    private forumService: ForumsService,
    private store: Store,
    private toast: MessageService,
    private router: Router
  ) {
    combineLatest([
      this.store.select(selectUser),
      this.store.select(selectAllForums)
    ]).subscribe(([user, forums]) => {
      this.user = user;
      this.forums = forums;
    });

    this.forumService
      .getAll()
      .pipe(first())
      .subscribe(
        forums => this.forums = forums,
        err => this.toast.add({ key: 'app-toast', severity: 'error', summary: 'Error', detail: err.error.message })
      );
  }

  ngOnInit(): void {
    
  }

  createForum() {
    this.store.dispatch(setFlyoutStatus({ status: FlyoutStatus.OPEN }));
    this.store.dispatch(setFlyoutContent({ title: 'Create forum', content: FlyoutContent.Forums.Add }));
  }

  getPostDate(forum: Forum) {
    return Formatter.getHumanDateTimeNoSeconds(forum.LastPostDate);
  }

  editForum(forum: Forum) {
    this.store.dispatch(setForum({ forum }));
    this.store.dispatch(setFlyoutContent({ title: `Edit ${forum.BoardName}`, content: FlyoutContent.Forums.Edit }));
    this.store.dispatch(setFlyoutStatus({ status: FlyoutStatus.OPEN }));
  }

  deleteForum(forumId: number) {
    this.forumService
      .delete(forumId)
      .pipe(first())
      .subscribe(
        forums => {
          this.store.dispatch(setAllForums({ forums }));
        },
        err => this.toast.add({ key: 'app-toast', severity: 'error', summary: 'Error', detail: err.error.message })
      );
  }

  openThreads(forumId: number) {
    this.router.navigate(['/forums', forumId, 'threads']);
  }
}
