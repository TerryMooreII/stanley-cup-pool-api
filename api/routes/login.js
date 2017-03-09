const Boom = require('boom');
const Joi = require('joi');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const authenticationService = require('../services/authentication');
const getErrorMessageFrom = require('../utils/mongoUtils').getErrorMessageFrom;


module.exports = exports = function(server) {
    console.log('Loading login routes');

    exports.login(server);
    exports.logout(server);
};


/**
 * POST /login
 * Validates the user and password
 *
 * @param server - The Hapi Serve
 */
exports.login = function(server) {
    var user;

    server.route({
        method: 'POST',
        path: '/login',
        config: {
            validate: {
                payload: {
                    email: Joi.string().required(),
                    password:Joi.string().required()
                }
            }
        },
        handler: function(request, reply) {
            var query = User.findOne({email: request.payload.email});

            query.select('+password').lean().exec(function(err, user) {
                if (err) {
                    reply(Boom.badImplementation(err));
                    return;
                }

                if (user && bcrypt.compareSync(request.payload.password, user.password)) {
                    var authData = authenticationService.store(user);
                    user.apikey = authData.apikey;
                    delete user.password;
                    reply(user);
                } else {
                    reply(Boom.unauthorized())
                }
            });
        }
    });
};

/**
 * POST /logout
 * Logs the user out
 *
 * @param server - The Hapi Serve
 */
exports.logout = function(server) {
    var user;

    server.route({
        method: 'POST',
        path: '/logout',
        handler: function(request, reply) {
            if (err) {
                reply(Boom.forbidden(getErrorMessageFrom(err))); // HTTP 403
                return;
            }

            authenticationService.logout(user);
            reply();
        }
    });
};
