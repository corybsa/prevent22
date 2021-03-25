import { Component, OnInit } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { Forum } from 'src/app/models/forum/forum';
import { ForumsService } from 'src/app/services/forums/forums.service';
import * as moment from 'moment';
import { Formatter } from 'src/app/models/formatter';
import { User } from 'src/app/models/user/user';
import { select, Store } from '@ngrx/store';
import { selectUser } from 'src/app/state/user/user.selectors';
import { SystemRoles } from 'src/app/models/user/system-roles';
import { selectFlyout } from 'src/app/state/flyout/flyout.selectors';
import { setFlyoutContent, setFlyoutStatus } from 'src/app/state/flyout/flyout.actions';
import { FlyoutStatus } from 'src/app/models/flyout/flyout-status';
import { FlyoutContent } from 'src/app/models/flyout/flyout-content';
import { selectAllForums } from 'src/app/state/forums/forums.selectors';
import { first } from 'rxjs/operators';
import { setAllForums } from 'src/app/state/forums/forums.actions';

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.css']
})
export class ForumComponent implements OnInit {
  forums: Forum[];
  user: User;
  systemRoles = SystemRoles;

  constructor(
    private forumService: ForumsService,
    private store: Store
  ) {
    combineLatest([
      this.store.select(selectUser),
      this.store.select(selectAllForums)
    ]).subscribe(([user, forums]) => {
      this.user = user;
      this.forums = forums;
    });

    this.forumService.getAll().pipe(first()).subscribe(forums => this.forums = forums);
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

  deleteForum(forumId: number) {
    this.forumService.delete(forumId).pipe(first()).subscribe(forums => {
      this.store.dispatch(setAllForums({ forums }));
    });
  }
}
