// import SHA256 from 'crypto-js/sha256';

var initialization = {
    name: 'ID5',
    moduleId: '248',

    /*  ****** Fill out initForwarder to load your SDK ******
    Note that not all arguments may apply to your SDK initialization.
    These are passed from mParticle, but leave them even if they are not being used.
    forwarderSettings contain settings that your SDK requires in order to initialize
    userAttributes example: {gender: 'male', age: 25}
    userIdentities example: { 1: 'customerId', 2: 'facebookId', 7: 'emailid@email.com' }
    additional identityTypes can be found at https://github.com/mParticle/mparticle-sdk-javascript/blob/master-v2/src/types.js#L88-L101
*/
    initForwarder: function(forwarderSettings, testMode, userAttributes, userIdentities, processEvent, eventQueue, isInitialized, common, appVersion, appName, customFlags, clientId) {
        /* `forwarderSettings` contains your SDK specific settings such as apiKey that your customer needs in order to initialize your SDK properly */

        if (!testMode) {
            /* Load your Web SDK here using a variant of your snippet from your readme that your customers would generally put into their <head> tags
               Generally, our integrations create script tags and append them to the <head>. Please follow the following format as a guide:
            */

            var clientScript = document.createElement('script');
            clientScript.type = 'text/javascript';
            clientScript.async = true;
            clientScript.src = 'https://cdn.id5-sync.com/api/1.0/id5-api.js';   // <---- Update this to be your script
            (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(clientScript);
            clientScript.onload = function() {
                var partnerData = buildPartnerData(userIdentities);

                //To-Do: PartnerUserId to be added to the init options once received from id5
                window.ID5.init({partnerId: forwarderSettings.partnerId, pd: partnerData}).onAvailable(function(status) {
                    var id5Id = status.getID5Id();
                    var idType = forwarderSettings.id5IdType;
                    var identities = {};
                    identities[idType] = id5Id;

                    window.mParticle.Identity.modify({userIdentities: identities}, identityCallback)
                });
            };
        } else {
            // For testing, you should fill out this section in order to ensure any required initialization calls are made,
            // clientSDKObject.initialize(forwarderSettings.apiKey)
        }
    }
};


function buildPartnerData(userIdentities) {
    var pdKeys = {};

    var email = userIdentities.userIdentities['email'];
    var processedEmail = normalizeAndHashEmail(email);
    if (processedEmail) pdKeys[1] = processedEmail;

    var phone = userIdentities.userIdentities['mobile_number'];
    var processedPhone = normalizeAndHashPhone(phone);
    if (processedPhone) pdKeys[2] = processedPhone;

    var fullUrl = window.location.href;
    if (fullUrl) pdKeys[8] = encodeURIComponent(fullUrl);

    var domain = window.location.host;
    if (domain) pdKeys[9] = domain;

    // Below may not be accessible from kit
    var deviceIPv4;
    if (deviceIPv4) pdKeys[10] = encodeURIComponent(deviceIPv4);

    var userAgentString;
    if (userAgentString) pdKeys[12] = encodeURIComponent(userAgentString);

    var idfv;
    if (idfv) pdKeys[14] = encodeURIComponent(idfv);

    var pdRaw = Object.keys(pdKeys).map(function(key){
        return key + '=' + pdKeys[key]
    }).join('&');

    return btoa(pdRaw);
}

function normalizeAndHashEmail(email) {
    var SHA256 = require('crypto-js/sha256');

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
    var SHA256 = require('crypto-js/sha256');

    var charactersToRemove = [' ', '-', '(', ')']
    charactersToRemove.forEach(function(character) {
        phone = phone.replaceAll(character, '');
    })
    return SHA256(phone);
}

module.exports = initialization;
