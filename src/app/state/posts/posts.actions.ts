import { createAction, props } from "@ngrx/store";
import { Post } from "src/app/models/post/post";

export const setPosts = createAction(
    '[Posts] Set Posts',
    props<{ posts: Post[] }>()
);

export const setPost = createAction(
    '[Posts] Set Post',
    props<{ post: Post }>()
);
