const fastify = require("fastify")({ logger: false });

// CORS : for testing only
// fastify.register(require("fastify-cors"), {
//   origin: "*", // allow all orinins
//   methods: ["GET", "POST", "DELETE"],
// });

fastify.register(require("fastify-nextjs")).after(() => {
  fastify.register(require("./pm2_routes"));
});

/////////////////////////////
// Run the server
/////////////////////////////

fastify.listen(3000, (err) => {
  if (err) {
    throw err;
  }
  console.log("Server listening on http://localhost:3000");
});
