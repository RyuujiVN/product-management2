

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

module.exports.forgotPassword = (req, res, next) => {
    if (!req.body.email) {
        return;
    }

    next();
}

module.exports.resetPassword = (req, res, next) => {
    console.log(req.body);
    if (!req.body.password) {
        return;
    }

    if (!req.body.confirmPassword) {
        return;
    }

    if (req.body.password != req.body.confirmPassword) {
        console.log("Xác nhận mật khẩu sai");
        return;
    }
    
    next();
}