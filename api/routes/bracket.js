const Boom = require('boom');
const Joi = require('joi');
const Bracket = require('../models/bracket');
const getErrorMessageFrom = require('../utils/mongoUtils').getErrorMessageFrom;


module.exports = exports = function (server) {

    console.log('Loading bracket routes');

    exports.getAll(server);
    exports.get(server);
    exports.put(server);
    exports.post(server);
    exports.delete(server);
};


/**
 * GET /brackets
 * Gets all the brackets from MongoDb and returns them.
 *
 * @param server - The Hapi Server
 */
exports.getAll = function (server) {
    server.route({
        method: 'GET',
        path: '/brackets',
        handler: function (request, reply) {
            Bracket.find({}, function (err, brackets) {
                if (!err) {
                    reply(brackets);
                } else {
                    reply(Boom.badImplementation(err));
                }
            });
        }
    });
};


/**
 * GET /brackets/{id}
 * Gets bracket from MongoDb with specifed id and returns them.
 *
 * @param server - The Hapi Server
 */
exports.get = function (server) {

    server.route({
        method: 'GET',
        path: '/brackets/{id}',
        config: {
            validate: {
                params: {
                    id: Joi.string().alphanum().min(5).required()
                }
            }
        },
        handler: function (request, reply) {
            Bracket.findById(request.params.id, function (err, bracket) {
                if (!err && bracket) {
                    reply(bracket);
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
 * DELETE /brackets/{id}
 * Deletes bracket from MongoDb with specifed id and returns null.
 *
 * @param server - The Hapi Server
 */
exports.delete = function (server) {

    server.route({
        method: 'DELETE',
        path: '/brackets/{id}',
        config: {
            validate: {
                params: {
                    id: Joi.string().alphanum().min(5).required()
                }
            }
        },
        handler: function (request, reply) {
            Bracket.findById(request.params.id, function (err, bracket) {
                 if(!err && bracket) {
                    bracket.remove();
                    reply('success');
                } else if(!err) {
                    // Couldn't find the object.
                    reply(Boom.notFound());
                } else {
                    console.log(err);
                    reply(Boom.badRequest("Could not delete bracket"));
                }
            });
        }
    })
};

/**
 * POST /new
 * Creates a new bracket in the datastore.
 *
 * @param server - The Hapi Serve
 */
exports.post = function (server) {
    var bracket;

    server.route({
        method: 'POST',
        path: '/brackets',
        handler: function (request, reply) {

            bracket = new Bracket(request.payload);

            bracket.save(function (err) {
                if (!err) {
                    reply(bracket).created('/brackets/' + bracket._id);    // HTTP 201
                } else {
                    reply(Boom.forbidden(getErrorMessageFrom(err))); // HTTP 403
                }
            });
        }
    });
};

/**
 * PUT /brackets/{id}
 * Updates a bracket in the datastore by id.
 *
 * @param server - The Hapi Serve
 */
exports.put = function (server) {
    var bracket;

    server.route({
        method: 'PUT',
        path: '/brackets/{id}',
        config: {
            validate: {
                params: {
                    id: Joi.string().alphanum().min(5).required()
                }
            }
        },
        handler: function (request, reply) {
            Bracket.findByIdAndUpdate(request.params.id, request.payload, function (err, bracket) {
                if (!err) {
                  reply(bracket).created('/brackets/' + bracket._id);
                } else {
                    reply(Boom.forbidden(getErrorMessageFrom(err))); // HTTP 403
                }
            });
        }
    });
};
