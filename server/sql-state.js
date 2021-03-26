class SqlState {
    constructor() {
        this.UsernameInUse = 1;
        this.UserIsBanned = 2;

        this.Other = 255;
    }
}

module.exports = new SqlState();
