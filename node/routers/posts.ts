import axios, { AxiosError } from 'axios'
import { likeDB } from '../likeDB'
import * as Boom from '@hapi/boom'
import { Request, Server } from '@hapi/hapi';

export function initPostsRouter(server: Server): Server {
  server.route({
    method: 'GET',
    path: '/posts/remote',
    handler: async () => {
      try{
        const posts = await axios.get("https://jsonplaceholder.typicode.com/posts", {timeout: 2000})
        return posts.data
      }catch(err){
        if(axios.isAxiosError(err)){
          if(err.code === 'ECONNABORTED'){
            return Boom.gatewayTimeout("remote server timeout")
          }
        }

        return Boom.badImplementation("remote server error")
      }
    }
  });

  // get only posts in memory
  server.route({
    method: 'GET',
    path: '/posts/memory',
    handler: async () => {
        const {data: posts, err} = await likeDB.posts.getAll()
        if(err){ 
            return Boom.badImplementation("db error")
        }
        return posts
    }
  });

  // get all posts on remote and memory
  server.route({
    method: 'GET',
    path: '/posts',
    handler: async () => {
        const {data: postlocal, err} = await likeDB.posts.getAll()
        try{
          const postRemote = await axios.get("https://jsonplaceholder.typicode.com/posts", {timeout: 2000})
          return [...(err ? [] : postlocal), ...postRemote.data]
        } catch(err){
          if(postlocal){
            return postlocal
          }
        }
        return [...(err ? [] : postlocal)]
    }
  });

  // get first post by id on remote and memory
  // try to get post from memory or from remote
  server.route({
    method: 'GET',
    path: '/posts/{id}',
    handler: async (request:Request) => {
        const { params: { id: userId } } = request

        const { data: postlocal, err: postlocalError } = await likeDB.posts.findByPk(userId)

        try {
            const postRemote = await axios.get("https://jsonplaceholder.typicode.com/posts/" + userId, {timeout: 2000})
            return !postlocalError && postlocal ? postlocal: postRemote.data
          } catch (err) {
            if(axios.isAxiosError(err)){
              if(err.code === 'ECONNABORTED'){
                return Boom.gatewayTimeout("remote server timeout")
              }
            }

            if(postlocal){
              return !postlocalError && postlocal || []
            }
          }
    
          return !postlocalError && postlocal || []
    }
  });

  return server;
}
