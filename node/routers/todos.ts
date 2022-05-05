import { likeDB } from '../likeDB'
import * as Boom from '@hapi/boom'
import { Request, Server } from "@hapi/hapi";
import { Todo } from '../types';

export function initTodoRouter(server: Server): Server {
  // get all todos on remote and memory
  server.route({
    method: 'GET',
    path: '/todo',
    handler: async () => {
      const {data: todos, err} = await likeDB.todos.getAll()
      if(err){
        return Boom.badGateway("db error")
      }
      return todos
    }
  });

  // get first todo by id on remote and memory
  server.route({
    method: 'GET',
    path: '/todo/{id}',
    handler: async (request: Request) => {
      const { params: {id: todoId } } = request
      const {data: todo, err} = await likeDB.todos.getByPK(todoId)
      if(err){
        return Boom.badGateway("db error")
      }
      return todo
    }
  });

  // create todo
  server.route({
    method: 'POST',
    path: '/todo',
    handler: async (request:Request) => {
      const { title, completed } = request.payload as TodoCreate
      const {data: todo, err} = await likeDB.todos.create({title, completed})
      if(err){
        console.log("wad")
        return Boom.badGateway("db error")
      }
      return todo
    }
  });

    // delete todo
    server.route({
        method: 'DELETE',
        path: '/todo/{id}',
        handler: async (request:Request) => {
            const { params: {id: todoId } } = request
            const {data: todo, err} = await likeDB.todos.destroy(todoId)
            if(err){
                return Boom.badGateway("db error")
            }
            return todo
        }
    });

    // update todo
    server.route({
        method: 'PUT',
        path: '/todo',
        handler: async (request:Request) => {
            const { title, completed, id } = request.payload as TodoUpdate
            const {data: todo} = await likeDB.todos.update(id, {
                title, completed
            })
            return todo
        }
    });

  return server;
}

type TodoUpdate = Todo
type TodoCreate = Omit<Todo, 'id'>