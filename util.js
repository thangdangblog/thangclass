class Util {
    static isAdmin(user) {
        if (user && user.username == "thangdangblog") {
            return true;
        }
        return false;
    }

    static numberWithCommas(x, comma = ",") {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, comma);
    }

    static wrapBox(content) {
        return "```" + content + "```";
    }
    
}

module.exports = Util;