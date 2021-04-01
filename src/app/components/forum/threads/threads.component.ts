import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { MessageService } from 'primeng/api';
import { combineLatest } from 'rxjs';
import { first } from 'rxjs/operators';
import { FlyoutContent } from 'src/app/models/flyout/flyout-content';
import { FlyoutStatus } from 'src/app/models/flyout/flyout-status';
import { Formatter } from 'src/app/models/formatter';
import { Helper } from 'src/app/models/helper';
import { Thread } from 'src/app/models/thread/thread';
import { SystemRoles } from 'src/app/models/user/system-roles';
import { User } from 'src/app/models/user/user';
import { ForumsService } from 'src/app/services/forums/forums.service';
import { ThreadsService } from 'src/app/services/forums/threads.service';
import { setFlyoutContent, setFlyoutStatus } from 'src/app/state/flyout/flyout.actions';
import { setForum } from 'src/app/state/forums/forums.actions';
import { setThread, setThreads } from 'src/app/state/threads/threads.actions';
import { selectThreads } from 'src/app/state/threads/threads.selectors';
import { selectUser } from 'src/app/state/user/user.selectors';

@Component({
  selector: 'app-threads',
  templateUrl: './threads.component.html',
  styleUrls: ['./threads.component.css']
})
export class ThreadsComponent implements OnInit {
  forumId: number;
  threads: Thread[];
  user: User;
  systemRoles = SystemRoles;

  loading = true;
  rows = 10;

  constructor(
    private service: ThreadsService,
    private forumService: ForumsService,
    private route: ActivatedRoute,
    private store: Store,
    private toast: MessageService,
    private router: Router
  ) {
    this.forumId = +this.route.snapshot.paramMap.get('forumId');

    this.forumService.get(this.forumId).subscribe(
      forum => this.store.dispatch(setForum({ forum })),
      err => Helper.showError(this.toast, err.error.message)
    );
    
    combineLatest([
      this.store.select(selectUser),
      this.store.select(selectThreads)
    ]).subscribe(([user, threads]) => {
      this.user = user;
      this.threads = threads;
      
      if(this.threads.length > 0) {
        this.loading = false;
      }
    });

    this.getThreads();
  }

  ngOnInit(): void {
  }

  getThreads() {
    this.service
      .getAll(this.forumId)
      .pipe(first())
      .subscribe(
        threads => this.store.dispatch(setThreads({ threads })),
        err => Helper.showError(this.toast, err.error.message)
      );
  }

  getPostDate(thread: Thread) {
    return Formatter.getHumanDateTimeNoSeconds(thread.LastPostDate);
  }

  createThread() {
    this.store.dispatch(setFlyoutContent({ title: 'Create Thread', content: FlyoutContent.Threads.Add, onClose: this.getThreads.bind(this) }));
    this.store.dispatch(setFlyoutStatus({ status: FlyoutStatus.Open }));
  }

  editThread(thread: Thread) {
    this.store.dispatch(setThread({ thread }));
    this.store.dispatch(setFlyoutContent({ title: `Edit ${thread.ThreadName}`, content: FlyoutContent.Threads.Edit }));
    this.store.dispatch(setFlyoutStatus({ status: FlyoutStatus.Open }));
  }

  deleteThread(threadId: number) {
    this.service.delete(threadId).subscribe(
      threads => {
        this.threads = threads;
        Helper.showSuccess(this.toast, 'Thread deleted!');
      },
      err => Helper.showError(this.toast, err.error.message)
    )
  }

  openPosts(thread: Thread) {
    this.store.dispatch(setThread({ thread }));
    this.router.navigate(['/forums', thread.BoardId, 'threads', thread.ThreadId]);
  }

  changePage(e) {
    this.rows = e.rows;
  }
}
