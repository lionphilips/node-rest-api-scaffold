'use strict'

const repository = require('../repositories/user-repository');
const validationContract = require('../validators/validator');
const emailService = require('../services/email-service');
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
 * @apiSuccess {String} message Confirmation message
 */
exports.post = async(req, res, next) => {
    try {
        let contract = new validationContract();
        contract.hasMinLen(req.body.name, 3, 'O nome deve conter pelo menos 3 caracteres');
        contract.isEmail(req.body.email, 'Email inválido');
        contract.hasMinLen(req.body.password, 6, 'A senha deve conter pelo menos 6 caracteres');

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

        emailService.send(req.body.email, 'Seja Bem-vindo ao Node Store', global.EMAIL_TMPL.replace('{0}', req.body.name))

        res.status(200).send({message: 'Cliente cadastrado com sucesso'});
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
 */
exports.authenticate = async(req, res, next) => {
    try {
        let customer = await repository.authenticate({
            email: req.body.email,
            password: md5(req.body.password + global.SALT_KEY)
        });

        if(!customer) {
            res.status(400).send({error: 'Usuário ou senha inválidos!'});
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
 */
exports.refreshToken = async(req, res, next) => {
    try {
        let token = req.body.token || req.query.token || req.headers['x-access-token'];
        let data = await authService.decodeToken(token);
        const customer = await repository.getById(data.id);

        if(!customer) {
            res.status(400).send({error: 'Usuário não encontrado'});
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