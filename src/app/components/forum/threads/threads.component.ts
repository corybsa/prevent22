import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { MessageService } from 'primeng/api';
import { combineLatest } from 'rxjs';
import { first } from 'rxjs/operators';
import { Formatter } from 'src/app/models/formatter';
import { Thread } from 'src/app/models/thread/thread';
import { SystemRoles } from 'src/app/models/user/system-roles';
import { User } from 'src/app/models/user/user';
import { ThreadsService } from 'src/app/services/forums/threads.service';
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

  constructor(
    private service: ThreadsService,
    private route: ActivatedRoute,
    private store: Store,
    private toast: MessageService
  ) {
    this.forumId = +this.route.snapshot.paramMap.get('forumId');
    
    combineLatest([
      this.store.select(selectUser),
      this.store.select(selectThreads)
    ]).subscribe(([user, threads]) => {
      this.user = user;
      this.threads = threads;
    });

    this.service
      .get(this.forumId)
      .pipe(first())
      .subscribe(
        threads => this.threads = threads,
        err => this.toast.add({ key: 'app-toast', severity: 'error', summary: 'Error', detail: err.error.message })
      );
  }

  ngOnInit(): void {
  }

  getPostDate(thread: Thread) {
    return Formatter.getHumanDateTimeNoSeconds(thread.LastPostDate);
  }

  createThread() {}

  editThread(thread: Thread) {}

  deleteThread(threadId: number) {}

  openPosts(threadId: number) {}
}
