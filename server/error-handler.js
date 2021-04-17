const SqlState = require('./sql-state');

module.exports = (err, req, res, next) => {
    if(err) {
        if(err.state) {
            switch(err.state) {
                case SqlState.UsernameInUse:
                    return res.status(400).json({ message: err.message });
                case SqlState.UserIsBanned:
                    // req.logout();
                    // res.clearCookie('sessionId', { httpOnly: true });
                    return res.status(403).redirect('/auth/login');
                case SqlState.Other:
                    return res.status(500).json({ message: err.message });
            }
        }
    }

    next();
};
