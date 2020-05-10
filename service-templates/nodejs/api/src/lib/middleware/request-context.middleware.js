/**
 * Creates a namespaced object on the Express res.locals object to persist data through the middleware stack.
 * @param {Object} req - Express Request object.
 * @param {Object} res - Express Response object.
 * @param {Function} next - Express 'next' function.
 * @returns
 * 
*/

module.exports = function requestContext(req, res, next) {
    Object.defineProperty(res.locals, 'CONTEXT', {
        value: Object.defineProperty({}, 'permissions', {
            value: {},
            configurable: false,
            enumerable: true,
            writable: true
        }),
        configurable: false,
        enumerable: true,
        writable: true
    })
    next();
}