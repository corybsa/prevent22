import { createAction, props } from "@ngrx/store";
import { Forum } from "src/app/models/forum/forum";

export const setAllForums = createAction(
    '[Forums] Set All Forums',
    props<{ forums: Forum[] }>()
);

export const setForum = createAction(
    '[Forums] Set Forum',
    props<{ forum: Forum }>()
);
