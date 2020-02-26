const ServerError = require('../error.lib.js');
const accessGrants = require('../../config/grants.json');
const AccessControl = require('accesscontrol');
const jwt = require('jsonwebtoken');
const ac = new AccessControl(accessGrants.grants);

//This function needs to be curried so we can programatically pre-apply the relevant permission and resource (e.g. 'readAny' and 'beers')
module.exports = function authorizeRequest(req, res, next) {
    try {
        const authToken = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.decode(authToken);
        const permission = ac.can(decodedToken.role[0])['readAny']('beers');
        console.log(permission.granted);
        
    } catch(e) {
        throw new ServerError({
            status: 401,
            error: 'Missing or bad authorization'
        });
    }
    next();
}