//Creates a namespaced object on the Express res.locals object to persist data through the middleware stack.
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