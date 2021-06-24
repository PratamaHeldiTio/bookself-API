const Hapi = require('@hapi/hapi');
const routes = require('./routes');

const init = async () => {
  const server = Hapi.server({
    port: 5000,
    host: 'localhost',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  // menambahkan routes
  server.route(routes);

  // menjalankan server
  await server.start();
  console.log(`berhasil menjalankan server pada ${server.info.uri}`);
};

init();
