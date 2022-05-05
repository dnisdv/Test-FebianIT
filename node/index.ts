import { initPostsRouter, initUsersRouter } from "./routers";
import { initTodoRouter } from "./routers/todos";
const Hapi = require('@hapi/hapi');

const PORT = process.env.PORT || 8080;

async function main(): Promise<void> {
  const server = Hapi.server({
    port: PORT,
    host: 'localhost'
  });

  initUsersRouter(server);
  initPostsRouter(server);
  initTodoRouter(server);

  return new Promise(async (resolve) => {
    await server.start()
    resolve()
  });
}


main().then(() => console.info('app started')).catch(console.error);