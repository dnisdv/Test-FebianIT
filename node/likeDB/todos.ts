import generateUniqueNumberId from "../utils/generateUniqueId";
import { Todo } from "../types";
const todos = [
    {
        id: 1,
        title: 'Todo 1',
        completed: false
    }
]


export const TodoModel = {
    getAll(): Promise<{data: Todo[], err: null | string}> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                return resolve({data: todos, err: null})
            }, 1000);
        })
    },

    getByPK(id: number): Promise<{data: Todo, err: null | string}> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                return resolve({data: todos.find(todo => +todo.id === +id) as Todo || [], err: null})
            }, 1000);
        })
    },

    create(todo: Omit<Todo, 'id'>): Promise<{data: Todo, err: null | string}> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const newTodo = {
                    id: generateUniqueNumberId(),
                    ...todo
                }
                todos.push(newTodo)
                return resolve({data: newTodo, err: null})
            }, 1000);
        })
    },

    destroy(id: number): Promise<{data: Todo, err: null | string}> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                console.log("HERE WORK")
                const todo = todos.find(todo => +todo.id === +id) as Todo
                todos.splice(todos.indexOf(todo), 1)
                return resolve({data: todo, err: null})
            }, 1000);
        })
    },

    update(id: number, todo: Omit<Todo, 'id'>): Promise<{data: Todo, err: null | string}> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const updated = todos.find(todo => +todo.id === +id) as Todo
                updated.title = todo.title
                updated.completed = todo.completed
                return resolve({data: updated, err: null})
            }, 1000);
        })
    }
}
