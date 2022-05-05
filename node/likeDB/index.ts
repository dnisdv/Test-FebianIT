import { UserModel } from "./users"
import { PostModel } from "./posts"
import { TodoModel } from "./todos"

export const likeDB = {
    users: UserModel,
    posts: PostModel,
    todos: TodoModel
}