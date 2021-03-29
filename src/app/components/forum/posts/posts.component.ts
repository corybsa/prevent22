import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { MessageService } from 'primeng/api';
import { combineLatest } from 'rxjs';
import { FlyoutContent } from 'src/app/models/flyout/flyout-content';
import { FlyoutStatus } from 'src/app/models/flyout/flyout-status';
import { Helper } from 'src/app/models/helper';
import { Post } from 'src/app/models/post/post';
import { Thread } from 'src/app/models/thread/thread';
import { SystemRoles } from 'src/app/models/user/system-roles';
import { User } from 'src/app/models/user/user';
import { PostsService } from 'src/app/services/forums/posts.service';
import { ThreadsService } from 'src/app/services/forums/threads.service';
import { setFlyoutContent, setFlyoutStatus } from 'src/app/state/flyout/flyout.actions';
import { setPost, setPosts } from 'src/app/state/posts/posts.actions';
import { selectPosts } from 'src/app/state/posts/posts.selectors';
import { setThread } from 'src/app/state/threads/threads.actions';
import { selectThread } from 'src/app/state/threads/threads.selectors';
import { selectUser } from 'src/app/state/user/user.selectors';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {
  forumId: number;
  thread = new Thread();
  posts: Post[];
  reply = new Post();
  user: User;
  systemRoles = SystemRoles;

  constructor(
    private postService: PostsService,
    private threadService: ThreadsService,
    private store: Store,
    private toast: MessageService,
    private route: ActivatedRoute
  ) {
    this.forumId = +this.route.snapshot.paramMap.get('forumId');
    const threadId = +this.route.snapshot.paramMap.get('threadId');

    combineLatest([
      this.store.select(selectThread),
      this.store.select(selectPosts),
      this.store.select(selectUser)
    ]).subscribe(([thread, posts, user]) => {
      this.thread = thread;
      this.posts = posts;
      this.user = user;
    })

    this.getThread(threadId);
    this.getPosts(threadId);
  }

  ngOnInit(): void {
  }

  getThread(threadId) {
    this.threadService.get(threadId).subscribe(
      thread => this.store.dispatch(setThread({ thread })),
      err => Helper.showError(this.toast, err.error.message)
    );
  }

  getPosts(threadId: number) {
    this.postService.getAll(threadId).subscribe(
      posts => this.store.dispatch(setPosts({ posts })),
      err => Helper.showError(this.toast, err.error.message)
    );
  }

  editPost(post: Post) {
    this.store.dispatch(setPost({ post }));
    this.store.dispatch(setFlyoutContent({ title: `Edit post from ${post.Author}`, content: FlyoutContent.Posts.Edit }));
    this.store.dispatch(setFlyoutStatus({ status: FlyoutStatus.Open }));
  }

  warnUser(post: Post) {
    this.store.dispatch(setPost({ post }));
    this.store.dispatch(setFlyoutContent({ title: `Issue warning to ${post.Author}`, content: FlyoutContent.User.Warn }));
    this.store.dispatch(setFlyoutStatus({ status: FlyoutStatus.Open }));
  }

  deletePost(post: Post) {
    this.postService.delete(post.PostId).subscribe(
      posts => {
        this.store.dispatch(setPosts({ posts }));
        Helper.showSuccess(this.toast, 'Post deleted!');
      },
      err => Helper.showError(this.toast, err.error.message)
    )
  }

  submitReply(form: NgForm) {
    this.postService.create(
      this.reply.Message,
      this.user.UserId,
      this.thread.ThreadId
    ).subscribe(
      post => {
        Helper.showSuccess(this.toast, 'Reply posted!');
        this.getPosts(post.ThreadId);
      },
      err => Helper.showError(this.toast, err.error.message)
    )
  }
}
