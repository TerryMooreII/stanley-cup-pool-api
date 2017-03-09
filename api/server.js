const Hapi = require('hapi');
const Path = require('path');
const Mongoose = require('mongoose');
const routes = require('./routes');
const config = require('./config');
const Inert = require('inert');

Mongoose.connect('mongodb://' +
    config.db.username + ':' +
    config.db.password + '@' +
    config.db.hostname + ':' +
    config.db.port + '/' +
    config.db.database);


const server = new Hapi.Server({
    connections: {
        routes: {
            files: {
                relativeTo: Path.join(__dirname, '../', 'web')
            }
        }
    }
});

server.connection({
  port: 3000,
  routes: {
    cors: {
          headers: ['Accept', 'Authorization', 'Content-Type', 'If-None-Match', 'X-API-KEY'],
          origin: ['*']
        }
    }
  });

server.register(Inert, () => {});

// server.route({
//     method: 'GET',
//     path: '/{param*}',
//     handler: {
//         directory: {
//             path: '.',
//             redirectToSlash: true,
//             index: true
//         }
//     }
// });

routes.init(server);

const options = {
    ops: {
        interval: 1000
    },
    reporters: {
        myConsoleReporter: [{
            module: 'good-squeeze',
            name: 'Squeeze',
            args: [{ log: '*', response: '*' }]
        }, {
            module: 'good-console'
        }, 'stdout'],
        myFileReporter: [{
            module: 'good-squeeze',
            name: 'Squeeze',
            args: [{ ops: '*' }]
        }, {
            module: 'good-squeeze',
            name: 'SafeJson'
        }, {
            module: 'good-file',
            args: ['./test/fixtures/awesome_log']
        }],
        myHTTPReporter: [{
            module: 'good-squeeze',
            name: 'Squeeze',
            args: [{ error: '*' }]
        }, {
            module: 'good-http',
            args: ['http://prod.logs:3000', {
                wreck: {
                    headers: { 'x-api-key': 12345 }
                }
            }]
        }]
    }
};


server.register({
    register: require('good')
}, (err) => {

    if (err) {
        return console.error(err);
    }
    server.start(() => {
        console.info(`Server started at ${ server.info.uri }`);
    });

});
