const Boom = require('boom');
const Joi = require('joi');
const User = require('../models/user');
const getErrorMessageFrom = require('../utils/mongoUtils').getErrorMessageFrom;
const bcrypt = require('bcrypt');

module.exports = exports = function(server) {

    console.log('Loading user routes');

    exports.getAll(server);
    exports.get(server);
    exports.put(server);
    exports.post(server);
    exports.delete(server);
};


/**
 * GET /users
 * Gets all the users from MongoDb and returns them.
 *
 * @param server - The Hapi Server
 */
exports.getAll = function(server) {
    server.route({
        method: 'GET',
        path: '/users',
        handler: function(request, reply) {
            User.find({}, function(err, users) {
                if (!err) {
                    reply(users);
                } else {
                    reply(Boom.badImplementation(err));
                }
            });
        }
    });
};


/**
 * GET /users/{id}
 * Gets user from MongoDb with specifed id and returns them.
 *
 * @param server - The Hapi Server
 */
exports.get = function(server) {

    server.route({
        method: 'GET',
        path: '/users/{id}',
        config: {
            validate: {
                params: {
                    id: Joi.string().alphanum().min(5).required()
                }
            }
        },
        handler: function(request, reply) {
            User.findById(request.params.id, function(err, user) {
                if (!err && user) {
                    reply(user);
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
 * DELETE /users/{id}
 * Deletes user from MongoDb with specifed id and returns null.
 *
 * @param server - The Hapi Server
 */
exports.delete = function(server) {

    server.route({
        method: 'DELETE',
        path: '/users/{id}',
        config: {
            validate: {
                params: {
                    id: Joi.string().alphanum().min(5).required()
                }
            }
        },
        handler: function(request, reply) {
            User.findById(request.params.id, function(err, user) {
                if (!err && user) {
                    user.remove();
                    reply('success');
                } else if (!err) {
                    // Couldn't find the object.
                    reply(Boom.notFound());
                } else {
                    console.log(err);
                    reply(Boom.badRequest("Could not delete user"));
                }
            });
        }
    })
};

/**
 * POST /new
 * Creates a new user in the datastore.
 *
 * @param server - The Hapi Serve
 */
exports.post = function(server) {
    var user;

    server.route({
        method: 'POST',
        path: '/users',
        handler: function(request, reply) {
            var newUser = request.payload;
            newUser.password = bcrypt.hashSync(request.payload.password, 5);
            user = new User(newUser);

            user.save(function(err) {
                if (!err) {
                    reply(user).created('/users/' + user._id); // HTTP 201
                } else {
                    reply(Boom.forbidden(getErrorMessageFrom(err))); // HTTP 403
                }
            });
        }
    });
};

/**
 * PUT /users/{id}
 * Updates a user in the datastore by id.
 *
 * @param server - The Hapi Serve
 */
exports.put = function(server) {
    var user;

    server.route({
        method: 'PUT',
        path: '/users/{id}',
        config: {
            validate: {
                params: {
                    id: Joi.string().alphanum().min(5).required()
                }
            }
        },
        handler: function(request, reply) {
            var newUser = request.payload;
            if (request.payload.password) {
                newUser.password = bcrypt.hashSync(request.payload.password, 5);
            }

            user = new User(newUser);

            User.findByIdAndUpdate(request.params.id, user, function(err, user) {
                if (!err) {
                    reply(user).created('/users/' + user._id);
                } else {
                    reply(Boom.forbidden(getErrorMessageFrom(err))); // HTTP 403
                }
            });
        }
    });
};
