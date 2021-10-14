const pm2 = require('pm2');
const fs = require('fs');

async function routes(fastify, options) {
  // console.log('[routes] called');

  pm2.connect((err) => {
    if (err) {
      console.error(err);
      process.exit(2);
    }
  });

  fastify.next('/', (app, req, resp) => {
    app.render(req.raw, resp.raw, '/index', req.query, {});
  });

  fastify.get('/pm2/list', async (req, resp) => {
    return new Promise((resolve, reject) => {
      pm2.list((err, list) => {
        if (err) {
          console.error(err);
          reject({ error: 'An error found' });
        }
        resolve({ items: list });
      });
    });
  });

  fastify.get('/pm2/monit', async (req, resp) => {
    // console.info(req.query);
    const pm_id = req.query.pm_id;

    return new Promise((resolve, reject) => {
      pm2.describe(pm_id, (err, data) => {
        if (err) {
          reject({ error: err });
        }
        // console.info(data[0]);
        resolve(data[0].monit);
      });
    });
  });

  fastify.get('/pm2/log', async (req, resp) => {
    // console.info(req.query);
    const pm_id = req.query.pm_id;

    return new Promise((resolve, reject) => {
      pm2.describe(pm_id, (err, data) => {
        if (err) {
          reject({ error: err });
        }
        // console.info(data[0]);
        try {
          const { pm_out_log_path, pm_err_log_path } = data[0].pm2_env;
          const outLog = fs.readFileSync(pm_out_log_path, 'utf8');
          const errLog = fs.readFileSync(pm_err_log_path, 'utf8');
          resolve({ outLog: outLog, errLog: errLog });
        } catch (error) {
          reject({ error: error });
        }
      });
    });
  });

  fastify.post('/pm2/process/add', async (req, resp) => {
    // TODO : check uniqueness of name
    const procParams = {
      name: req.body.name,
      script: req.body.script,
      args: req.body.args ? req.body.args : null,
      cwd: req.body.cwd ? req.body.cwd : null,
    };
    return new Promise((resolve, reject) => {
      pm2.start(procParams, (err, apps) => {
        if (err) {
          console.error(err);
          reject({ error: err });
          return;
        }
        // console.info(apps);
        resolve(apps);
      });
    });
  });

  fastify.post('/pm2/process/stop', async (req, resp) => {
    // console.info(req.query);
    const pm_id = req.query.pm_id;

    return new Promise((resolve, reject) => {
      pm2.stop(pm_id, (err, data) => {
        if (err) {
          reject({ error: err });
        }
        resolve(data);
      });
    });
  });

  fastify.post('/pm2/process/restart', async (req, resp) => {
    // console.info(req.query);
    const pm_id = req.query.pm_id;

    return new Promise((resolve, reject) => {
      pm2.restart(pm_id, (err, data) => {
        if (err) {
          reject({ error: err });
        }
        resolve(data);
      });
    });
  });

  fastify.delete('/pm2/process/delete', async (req, resp) => {
    // console.info(req.query);
    const pm_id = req.query.pm_id;

    return new Promise((resolve, reject) => {
      pm2.delete(pm_id, (err, data) => {
        if (err) {
          reject({ error: err });
        }
        resolve(data);
      });
    });
  });
}

module.exports = routes;
