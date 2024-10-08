var SHA256 = require('crypto-js/sha256');
function Common() {}

Common.prototype.exampleMethod = function () {
    return 'I am an example';
}

Common.prototype.logId5Id = function (id5Id) {
    //Checks and saves ID5 ID if it is new
    if (id5Id !== this.id5Id) {
        this.id5Id = id5Id;
        this.id5IdSent = false
    }

    //Sets user attribute if ID is unsent.
    //This function will be updated once the decryption architecture is finalized.
    //The ID may need to be sent as custom event.
    if (this.id5IdSent === false){
        var currentUser = mParticle.Identity.getCurrentUser();
        currentUser.setUserAttribute('ID5ID', id5Id);
        this.id5IdSent = true;
    }
};

Common.prototype.buildPartnerData = function (mParticleUser) {
    var pdKeys = {};
    var userIdentities = mParticleUser.getUserIdentities();

    var email = userIdentities.userIdentities['email'];
    if (email) {
        pdKeys[1] = SHA256(this.normalizeEmail(email));
    }

    var phone = userIdentities.userIdentities['mobile_number'];
    if (phone) {
        pdKeys[2]= SHA256(this.normalizePhone(phone));
    }

    var pdRaw = Object.keys(pdKeys).map(function(key){
        return key + '=' + pdKeys[key]
    }).join('&');

    return btoa(pdRaw);
}

Common.prototype.normalizeEmail = function(email) {
    var parts = email.split("@")
    var charactersToRemove = ['+', '.']

    if (parts[1] != 'gmail.com') {
        return email;
    }

    charactersToRemove.forEach(function(character) {
        parts[0] = parts[0].replaceAll(character, '').toLowerCase();
    })

    return parts.join('@');
}

Common.prototype.normalizePhone = function(phone) {
    var charactersToRemove = [' ', '-', '(', ')']

    charactersToRemove.forEach(function(character) {
        phone = phone.replaceAll(character, '');
    })

    return phone;
}

module.exports = Common;
