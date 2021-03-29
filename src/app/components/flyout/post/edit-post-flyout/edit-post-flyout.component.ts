import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { FlyoutStatus } from 'src/app/models/flyout/flyout-status';
import { Helper } from 'src/app/models/helper';
import { Post } from 'src/app/models/post/post';
import { PostsService } from 'src/app/services/forums/posts.service';
import { setFlyoutStatus } from 'src/app/state/flyout/flyout.actions';
import { setPosts } from 'src/app/state/posts/posts.actions';
import { selectPost } from 'src/app/state/posts/posts.selectors';

@Component({
  selector: 'app-edit-post-flyout',
  templateUrl: './edit-post-flyout.component.html',
  styleUrls: ['./edit-post-flyout.component.css']
})
export class EditPostFlyoutComponent implements OnInit, OnDestroy {
  subs: Subscription[] = [];
  post = new Post();

  constructor(
    private service: PostsService,
    private toast: MessageService,
    private store: Store
  ) {
    this.subs.push(
      this.store.select(selectPost).subscribe(post => this.post = Helper.copy(post))
    );
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  submit(form: NgForm) {
    if(form.valid) {
      this.subs.push(
        this.service.update(
          this.post.PostId,
          this.post.Message,
          this.post.CreatedBy,
          this.post.CreatedDate,
          this.post.ThreadId
        ).subscribe(
          posts => {
            Helper.showSuccess(this.toast, 'Post updated!');
            this.store.dispatch(setPosts({ posts }));
            this.store.dispatch(setFlyoutStatus({ status: FlyoutStatus.Closed }));
          },
          err => Helper.showError(this.toast, err.error.message)
        )
      );
    }
  }
}
