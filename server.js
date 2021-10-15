const fastify = require('fastify')({ logger: false, pluginTimeout: 1000000 });

// CORS : for testing only
// fastify.register(require("fastify-cors"), {
//   origin: "*", // allow all orinins
//   methods: ["GET", "POST", "DELETE"],
// });

fastify.register(require('fastify-nextjs')).after(() => {
  fastify.register(require('./pm2_routes'));
});

/////////////////////////////
// Run the server
/////////////////////////////

fastify.listen(3000, '0.0.0.0', (err) => {
  if (err) {
    throw err;
  }
  console.log('Server listening on http://0.0.0.0:3000');
});
