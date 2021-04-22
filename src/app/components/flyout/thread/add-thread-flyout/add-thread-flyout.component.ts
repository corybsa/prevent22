import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { MessageService } from 'primeng/api';
import { Observable, Subscription } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { FlyoutStatus } from 'src/app/models/flyout/flyout-status';
import { Forum } from 'src/app/models/forum/forum';
import { Helper } from 'src/app/models/helper';
import { Post } from 'src/app/models/post/post';
import { Thread } from 'src/app/models/thread/thread';
import { User } from 'src/app/models/user/user';
import { PostsService } from 'src/app/services/forums/posts.service';
import { ThreadsService } from 'src/app/services/forums/threads.service';
import { setFlyoutStatus } from 'src/app/state/flyout/flyout.actions';
import { selectForum } from 'src/app/state/forums/forums.selectors';
import { selectCurrentUser } from 'src/app/state/user/user.selectors';

@Component({
  selector: 'app-add-thread-flyout',
  templateUrl: './add-thread-flyout.component.html',
  styleUrls: ['./add-thread-flyout.component.css']
})
export class AddThreadFlyoutComponent implements OnInit, OnDestroy {
  subs: Subscription[] = [];
  forum: Forum;
  thread = new Thread();
  post = new Post();
  user: User;

  constructor(
    private threadService: ThreadsService,
    private postService: PostsService,
    private toast: MessageService,
    private store: Store
  ) {
    this.subs.push(
      this.store.select(selectCurrentUser).subscribe(user => this.user = user),
      this.store.select(selectForum).subscribe(forum => this.forum = forum)
    );
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  submit(form: NgForm) {
    if (form.valid) {
      this.createThread();
    }
  }

  createThread() {
    this.subs.push(
      this.threadService.create(
        this.forum.BoardId,
        this.thread.ThreadName,
        this.user?.UserId,
        !this.user ? true : this.thread.IsAnonymous,
        this.user ? this.user.Email : this.thread.Email
      ).subscribe(
        thread => this.createPost(thread),
        err => Helper.showError(this.toast, err.error.message)
      )
    );
  }

  createPost(thread: Thread) {
    this.subs.push(
      this.postService.create(
        this.post.Message,
        this.user?.UserId,
        thread.ThreadId,
        thread.IsAnonymous,
        this.user ? this.user.Email : this.thread.Email,
        thread.Code
      ).subscribe(
        post => {
          Helper.showSuccess(this.toast, 'Thread created!');
          this.store.dispatch(setFlyoutStatus({ status: FlyoutStatus.Closed }));
        },
        err => {
          Helper.showError(this.toast, err.error.message);
          this.deleteThread(thread);
        }
      )
    );
  }

  deleteThread(thread: Thread) {
    this.subs.push(
      this.threadService
        .delete(thread.ThreadId)
        .pipe(
          catchError(err => {
            Helper.showError(this.toast, err.error.message);
            return new Observable(o => o.complete());
          })
        )
        .subscribe()
    );
  }
}
