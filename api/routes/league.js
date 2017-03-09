const Boom = require('boom');
const Joi = require('joi');
const League = require('../models/league');
const getErrorMessageFrom = require('../utils/mongoUtils').getErrorMessageFrom;

module.exports = exports = function (server) {

    console.log('Loading league routes');

    exports.getAll(server);
    exports.get(server);
    exports.put(server);
    exports.post(server);
    exports.delete(server);
};


/**
 * GET /leagues
 * Gets all the leagues from MongoDb and returns them.
 *
 * @param server - The Hapi Server
 */
exports.getAll = function (server) {
    server.route({
        method: 'GET',
        path: '/leagues',
        handler: function (request, reply) {
            League.find({}, function (err, leagues) {
                if (!err) {
                    reply(leagues);
                } else {
                    reply(Boom.badImplementation(err));
                }
            });
        }
    });
};


/**
 * GET /leagues/{id}
 * Gets league from MongoDb with specifed id and returns them.
 *
 * @param server - The Hapi Server
 */
exports.get = function (server) {

    server.route({
        method: 'GET',
        path: '/leagues/{id}',
        config: {
            validate: {
                params: {
                    id: Joi.string().alphanum().min(5).required()
                }
            }
        },
        handler: function (request, reply) {
            League.findById(request.params.id, function (err, league) {
                if (!err && league) {
                    reply(league);
                } else if (err) {
                    console.log(err);
                    reply(Boom.notFound());
                } else {
                    reply(Boom.notFound());
                }
            });
        }
    })
};


/**
 * DELETE /leagues/{id}
 * Deletes league from MongoDb with specifed id and returns null.
 *
 * @param server - The Hapi Server
 */
exports.delete = function (server) {

    server.route({
        method: 'DELETE',
        path: '/leagues/{id}',
        config: {
            validate: {
                params: {
                    id: Joi.string().alphanum().min(5).required()
                }
            }
        },
        handler: function (request, reply) {
            League.findById(request.params.id, function (err, league) {
                 if(!err && league) {
                    league.remove();
                    reply('success');
                } else if(!err) {
                    // Couldn't find the object.
                    reply(Boom.notFound());
                } else {
                    console.log(err);
                    reply(Boom.badRequest("Could not delete league"));
                }
            });
        }
    })
};

/**
 * POST /new
 * Creates a new league in the datastore.
 *
 * @param server - The Hapi Serve
 */
exports.post = function (server) {
    var league;

    server.route({
        method: 'POST',
        path: '/leagues',
        handler: function (request, reply) {

            league = new League(request.payload);

            league.save(function (err) {
                if (!err) {
                    reply(league).created('/leagues/' + league._id);    // HTTP 201
                } else {
                    reply(Boom.forbidden(getErrorMessageFrom(err))); // HTTP 403
                }
            });
        }
    });
};

/**
 * PUT /leagues/{id}
 * Updates a league in the datastore by id.
 *
 * @param server - The Hapi Serve
 */
exports.put = function (server) {
    var league;

    server.route({
        method: 'PUT',
        path: '/leagues/{id}',
        config: {
            validate: {
                params: {
                    id: Joi.string().alphanum().min(5).required()
                }
            }
        },
        handler: function (request, reply) {
            League.findByIdAndUpdate(request.params.id, request.payload, function (err, league) {
                if (!err) {
                  reply(league).created('/leagues/' + league._id);
                } else {
                    reply(Boom.forbidden(getErrorMessageFrom(err))); // HTTP 403
                }
            });
        }
    });
};
