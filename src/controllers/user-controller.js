'use strict'

const repository = require('../repositories/user-repository');
const validationContract = require('../validators/validator');
const authService = require('../services/auth-service');
const md5 = require('md5');

/**
 * @api {get} /user Request Users information
 * @apiName GetUsers
 * @apiGroup User
 *
 * @apiSuccess {String} name Full name of the user
 * @apiSuccess {String} email  Email address of the User.
 * @apiSuccess {Boolean} active  Status of the User.
 * @apiSuccess {Object[]} roles  Roles of the User.
 * @apiSuccess {Datetime} created  Date user was created.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *          {
 *              "name": "Luis Filipe",
 *              "email": "lionphilips@gmail.com",
 *              "active": true,
 *              "roles": ["user", "admin"],
 *              "created": "2018-01-01 11:00:00",
 *          }
 *     ]
 *
 */
exports.get = async(req, res, next) => {
    try {
        let data = await repository.get();
        res.status(200).send(data);
    } catch(e) {
        res.status(500).send({message: 'Falha ao processar sua requisição'});
    }
}

/**
 * @api {get} /user/:id Request a specific User information
 * @apiName GetUser
 * @apiGroup User
 *
 * @apiParam {Number} id Users unique ID.
 *
 * @apiSuccess {String} name Full name of the user
 * @apiSuccess {String} email  Email address of the User.
 * @apiSuccess {Boolean} active  Status of the User.
 * @apiSuccess {Object[]} roles  Roles of the User.
 * @apiSuccess {Datetime} created  Date user was created.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *          "name": "Luis Filipe",
 *           "email": "lionphilips@gmail.com",
 *           "active": true,
 *           "roles": ["user", "admin"],
 *           "created": "2018-01-01 11:00:00",
 *     }
 *
 */
exports.getById = async(req, res, next) => {
    try {
        let data = await repository.getById(req.params.id);
        res.status(200).send(data);
    } catch(e) {
        res.status(500).send({message: 'Falha ao processar sua requisição'});
    }
}

/**
 * @api {post} /user/ Create a new User
 * @apiName CreateUser
 * @apiGroup User
 *
 * @apiParam {String} name User fullname.
 * @apiParam {String} email User email address.
 * @apiParam {String} password User password.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "User created"
 *     }
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *        "errors": {}
 *     }
 */
exports.post = async(req, res, next) => {
    try {
        let contract = new validationContract();
        contract.hasMinLen(req.body.name, 3, 'The name has to be at least 3 characters');
        contract.isEmail(req.body.email, 'Invalid email');
        contract.hasMinLen(req.body.password, 6, 'The password has to be at least 3 characters');

        if(!contract.isValid()) {
            res.status(400).send(contract.errors()).end();
            return;
        }

        await repository.create({
            name: req.body.name,
            email: req.body.email,
            password: md5(req.body.password + global.SALT_KEY),
            roles: ["user"]
        });

        res.status(200).send({message: 'User created'});
    } catch(e) {
        res.status(500).send({error: e});
    }
}

/**
 * @api {post} /user/authenticate Authenticate a User
 * @apiName AuthenticateUser
 * @apiGroup User
 *
 * @apiParam {String} email User email address.
 * @apiParam {String} password User password.
 *
 * @apiSuccess {String} token JWT Token.
 * @apiSuccess {Object} data User data.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "token": "some-long-key",
 *       "data": {
 *          "name": "Luis Filipe",
 *          "email": "lionphilips@gmail.com"
 *       }
 *     }
 *
 * @apiError UserNotFound The id of the User was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "User Not Found"
 *     }
 */
exports.authenticate = async(req, res, next) => {
    try {
        let customer = await repository.authenticate({
            email: req.body.email,
            password: md5(req.body.password + global.SALT_KEY)
        });

        if(!customer) {
            res.status(404).send({error: 'User not found'});
            return;
        }

        let token = await authService.generateToken({
            id: customer._id,
            name: customer.name,
            email: customer.email,
            roles: customer.roles
        });

        res.status(200).send({
            token: token,
            data: {
                name: customer.name,
                email: customer.email
            }
        });
    } catch(e) {
        res.status(500).send({error: e});
    }
}

/**
 * @api {post} /user/refresh-token Refresh JWT Token
 * @apiName RefreshToken
 * @apiGroup User
 *
 * @apiParam {String} token User email address.
 *
 * @apiSuccess {String} token New JWT Token.
 * @apiSuccess {Object} data User data.
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "token": "some-long-key",
 *       "data": {
 *          "name": "Luis Filipe",
 *          "email": "lionphilips@gmail.com"
 *       }
 *     }
 *
 * @apiError UserNotFound The id of the User was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "User Not Found"
 *     }
 */
exports.refreshToken = async(req, res, next) => {
    try {
        let token = req.body.token || req.query.token || req.headers['x-access-token'];
        let data = await authService.decodeToken(token);
        const customer = await repository.getById(data.id);

        if(!customer) {
            res.status(400).send({error: 'User not found'});
            return;
        }

        let refreshedToken = await authService.generateToken({
            id: customer._id,
            name: customer.name,
            email: customer.email,
            roles: customer.roles
        });

        res.status(200).send({
            token: refreshedToken,
            data: {
                name: customer.name,
                email: customer.email
            }
        });
    } catch(e) {
        res.status(500).send({error: e});
    }
}