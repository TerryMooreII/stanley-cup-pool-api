const Boom = require('boom');
const Joi = require('joi');
const Team = require('../models/team');
const getErrorMessageFrom = require('../utils/mongoUtils').getErrorMessageFrom;

module.exports = exports = function (server) {

    console.log('Loading team routes');

    exports.getAll(server);
    exports.get(server);
    exports.put(server);
    exports.post(server);
    exports.delete(server);
};


/**
 * GET /teams
 * Gets all the teams from MongoDb and returns them.
 *
 * @param server - The Hapi Server
 */
exports.getAll = function (server) {
    server.route({
        method: 'GET',
        path: '/teams',
        handler: function (request, reply) {
            Team.find({}, function (err, teams) {
                if (!err) {
                    reply(teams);
                } else {
                    reply(Boom.badImplementation(err));
                }
            });
        }
    });
};


/**
 * GET /teams/{id}
 * Gets team from MongoDb with specifed id and returns them.
 *
 * @param server - The Hapi Server
 */
exports.get = function (server) {

    server.route({
        method: 'GET',
        path: '/teams/{id}',
        config: {
            validate: {
                params: {
                    id: Joi.string().alphanum().min(5).required()
                }
            }
        },
        handler: function (request, reply) {
            Team.findById(request.params.id, function (err, team) {
                if (!err && team) {
                    reply(team);
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
 * DELETE /teams/{id}
 * Deletes team from MongoDb with specifed id and returns null.
 *
 * @param server - The Hapi Server
 */
exports.delete = function (server) {

    server.route({
        method: 'DELETE',
        path: '/teams/{id}',
        config: {
            validate: {
                params: {
                    id: Joi.string().alphanum().min(5).required()
                }
            }
        },
        handler: function (request, reply) {
            Team.findById(request.params.id, function (err, team) {
                 if(!err && team) {
                    team.remove();
                    reply('success');
                } else if(!err) {
                    // Couldn't find the object.
                    reply(Boom.notFound());
                } else {
                    console.log(err);
                    reply(Boom.badRequest("Could not delete team"));
                }
            });
        }
    })
};

/**
 * POST /new
 * Creates a new team in the datastore.
 *
 * @param server - The Hapi Serve
 */
exports.post = function (server) {
    var team;

    server.route({
        method: 'POST',
        path: '/teams',
        handler: function (request, reply) {

            team = new Team(request.payload);

            team.save(function (err) {
                if (!err) {
                    reply(team).created('/teams/' + team._id);    // HTTP 201
                } else {
                    reply(Boom.forbidden(getErrorMessageFrom(err))); // HTTP 403
                }
            });
        }
    });
};

/**
 * PUT /teams/{id}
 * Updates a team in the datastore by id.
 *
 * @param server - The Hapi Serve
 */
exports.put = function (server) {
    var team;

    server.route({
        method: 'PUT',
        path: '/teams/{id}',
        config: {
            validate: {
                params: {
                    id: Joi.string().alphanum().min(5).required()
                }
            }
        },
        handler: function (request, reply) {
            Team.findByIdAndUpdate(request.params.id, request.payload, function (err, team) {
                if (!err) {
                  reply(team).created('/teams/' + team._id);
                } else {
                    reply(Boom.forbidden(getErrorMessageFrom(err))); // HTTP 403
                }
            });
        }
    });
};
