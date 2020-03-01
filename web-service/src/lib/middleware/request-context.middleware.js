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