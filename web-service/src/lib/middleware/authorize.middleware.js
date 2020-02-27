const ServerError = require('../error.lib.js');
const accessGrants = require('../../config/grants.json');
const AccessControl = require('accesscontrol');
const jwt = require('jsonwebtoken');
const ac = new AccessControl(accessGrants.grants);

module.exports = function(action, resource) { 
    return function authorizeRequest(req, res, next) {
        try {
            const authToken = req.headers.authorization.split(" ")[1];
            const decodedToken = jwt.decode(authToken);
            const permission = ac.can(decodedToken.role[0])[action](resource);
            console.log(permission.granted);
            if (!permission.granted) {
                throw new ServerError({
                    status: 403,
                    error: 'Missing or invalid access grant(s).'
                });
            }
            //The requester has admin privileges.
            if (permission.granted && decodedToken.role[0] === 'admin') {
                next();
                return;
            }
            //The request is for a record whose id matches the subject claim on the authorization token.
            if (req.params.id && req.params.id !== decodedToken.sub) {
                throw new ServerError({
                    status: 403,
                    error: 'Access denied.'
                });
            }
            
            next();
            
        } catch(e) {
            console.error(e);
            throw new ServerError({
                status: e.status || 401,
                error: e.error || 'Missing or bad authorization.'
            });
        }
    }
}