var SHA256 = require('crypto-js/sha256');
function Common() {}

Common.prototype.exampleMethod = function () {
    return 'I am an example';
}

Common.prototype.logId5 = function () {
    var id5Id = this.id5Instance.getUserId();
    debugger;

    //Checks and saves ID5 ID if it is new
    if (id5Id != this.id5Id) {
        this.id5Id = id5Id;
        this.id5IdSent = false
    }

    //Only sends the ID5 ID Custom Event if unsent
    if (this.id5IdSent == false){
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
        var processedEmail = normalizeAndHashEmail(email);
        pdKeys[1] = processedEmail;
    }

    var phone = userIdentities.userIdentities['mobile_number'];
    if (phone) {
        var processedPhone = normalizeAndHashPhone(phone);
        pdKeys[2] = processedPhone;
    }

    //Candidates to be removed
    var fullUrl = window.location.href;
    if (fullUrl) pdKeys[8] = encodeURIComponent(fullUrl);

    var domain = window.location.host;
    if (domain) pdKeys[9] = domain;

    var userAgentString = navigator.userAgent;
    if (userAgentString) pdKeys[12] = encodeURIComponent(userAgentString);
    // above may be pulled from PD as they are un needed for the ID5 ID generation as a basic level


    var pdRaw = Object.keys(pdKeys).map(function(key){
        return key + '=' + pdKeys[key]
    }).join('&');

    return btoa(pdRaw);
}

function normalizeAndHashEmail(email) {
    var parts = email.split("@")
    var charactersToRemove = ['+', '.']

    if (parts[1] != 'gmail.com') {
        return email;
    }

    charactersToRemove.forEach(function(character) {
        parts[0] = parts[0].replaceAll(character, '').toLowerCase();
    })

    return SHA256(parts.join('@'));
}

function normalizeAndHashPhone(phone) {
    var charactersToRemove = [' ', '-', '(', ')']
    charactersToRemove.forEach(function(character) {
        phone = phone.replaceAll(character, '');
    })
    return SHA256(phone);
}

module.exports = Common;
