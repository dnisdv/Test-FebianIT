import axios, { AxiosError } from 'axios'
import { likeDB } from '../likeDB'
import * as Boom from '@hapi/boom'
import { Request, Server } from '@hapi/hapi';

export function initUsersRouter(server: Server): Server {

  // get only users on remote link
  server.route({
    method: 'GET',
    path: '/users/remote',
    handler: async () => {
      try{
        const users = await axios.get("https://jsonplaceholder.typicode.com/users", {timeout: 2000})
        return users.data
      }catch(err){
        if(axios.isAxiosError(err)){
          if(err.code === 'ECONNABORTED'){
            return Boom.gatewayTimeout("remote server timeout")
          }
        }

        return Boom.badGateway("remote server error")
      }
    }
  });

  // get only users in memory
  server.route({
    method: 'GET',
    path: '/users/memory',
    handler: async () => {
        const {data: users, err} = await likeDB.users.getAll()

        if(err){
          return Boom.badImplementation("db error")
        }
        return users
    }
  });

  // get all users on remote and memory
  server.route({
    method: 'GET',
    path: '/users',
    handler: async () => {
      const {data: userslocal, err} = await likeDB.users.getAll()
      try{
        const usersRemote = await axios.get("https://jsonplaceholder.typicode.com/users", {timeout: 2000})
        return [...(err ? [] : userslocal), ...usersRemote.data]
      } catch(err){
        if(axios.isAxiosError(err)){
          if(err.code === 'ECONNABORTED'){
            return Boom.gatewayTimeout("remote server timeout")
          }
        }
        if(userslocal){
          return userslocal
        }
      }
      return [...(err ? [] : userslocal)]
    }
  });

  // get first user by id on remote and memory
  // try to get user from memory or from remote
  server.route({
    method: 'GET',
    path: '/users/{id}',
    handler: async (request: Request) => {
      const { params: { id: userId } } = request
      const { data: userslocal, err: userslocalError } = await likeDB.users.findByPk(userId)

      try {
        const usersRemote = await axios.get("https://jsonplaceholder.typicode.com/users/" + userId, {timeout: 2000})
        return !userslocalError && userslocal ? userslocal: usersRemote.data
      } catch (e) {

        if(userslocal){
          return !userslocalError && userslocal || []
        }
      }

      return !userslocalError && userslocal || []
    }
  });

  return server;
}
