const Boom = require('boom');
const Joi = require('joi');
const Pick = require('../models/pick');
const getErrorMessageFrom = require('../utils/mongoUtils').getErrorMessageFrom;

module.exports = exports = function (server) {

    console.log('Loading pick routes');

    exports.getAll(server);
    exports.get(server);
    exports.put(server);
    exports.post(server);
    exports.delete(server);
};


/**
 * GET /picks
 * Gets all the picks from MongoDb and returns them.
 *
 * @param server - The Hapi Server
 */
exports.getAll = function (server) {
    server.route({
        method: 'GET',
        path: '/picks',
        handler: function (request, reply) {
            Pick.find({}, function (err, picks) {
                if (!err) {
                    reply(picks);
                } else {
                    reply(Boom.badImplementation(err));
                }
            });
        }
    });
};


/**
 * GET /picks/{id}
 * Gets pick from MongoDb with specifed id and returns them.
 *
 * @param server - The Hapi Server
 */
exports.get = function (server) {

    server.route({
        method: 'GET',
        path: '/picks/{id}',
        config: {
            validate: {
                params: {
                    id: Joi.string().alphanum().min(5).required()
                }
            }
        },
        handler: function (request, reply) {
            Pick.findById(request.params.id, function (err, pick) {
                if (!err && pick) {
                    reply(pick);
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
 * DELETE /picks/{id}
 * Deletes pick from MongoDb with specifed id and returns null.
 *
 * @param server - The Hapi Server
 */
exports.delete = function (server) {

    server.route({
        method: 'DELETE',
        path: '/picks/{id}',
        config: {
            validate: {
                params: {
                    id: Joi.string().alphanum().min(5).required()
                }
            }
        },
        handler: function (request, reply) {
            Pick.findById(request.params.id, function (err, pick) {
                 if(!err && pick) {
                    pick.remove();
                    reply('success');
                } else if(!err) {
                    // Couldn't find the object.
                    reply(Boom.notFound());
                } else {
                    console.log(err);
                    reply(Boom.badRequest("Could not delete pick"));
                }
            });
        }
    })
};

/**
 * POST /new
 * Creates a new pick in the datastore.
 *
 * @param server - The Hapi Serve
 */
exports.post = function (server) {
    var pick;

    server.route({
        method: 'POST',
        path: '/picks',
        handler: function (request, reply) {

            pick = new Pick(request.payload);

            pick.save(function (err) {
                if (!err) {
                    reply(pick).created('/picks/' + pick._id);    // HTTP 201
                } else {
                    reply(Boom.forbidden(getErrorMessageFrom(err))); // HTTP 403
                }
            });
        }
    });
};

/**
 * PUT /picks/{id}
 * Updates a pick in the datastore by id.
 *
 * @param server - The Hapi Serve
 */
exports.put = function (server) {
    var pick;

    server.route({
        method: 'PUT',
        path: '/picks/{id}',
        config: {
            validate: {
                params: {
                    id: Joi.string().alphanum().min(5).required()
                }
            }
        },
        handler: function (request, reply) {
            Pick.findByIdAndUpdate(request.params.id, request.payload, function (err, pick) {
                if (!err) {
                  reply(pick).created('/picks/' + pick._id);
                } else {
                    reply(Boom.forbidden(getErrorMessageFrom(err))); // HTTP 403
                }
            });
        }
    });
};
