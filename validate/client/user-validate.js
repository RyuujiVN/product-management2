

module.exports.register = (req, res, next) => {
    if (!req.body.fullName) {
        return;
    }

    if (!req.body.email) {
        return;
    }

    if (!req.body.password) {
        return;
    }

    next();
}

module.exports.login = (req, res, next) => {
    
    if (!req.body.email) {
        return;
    }

    if (!req.body.password) {
        return;
    }

    next();
}