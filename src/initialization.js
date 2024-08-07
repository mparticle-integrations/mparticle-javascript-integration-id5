// import SHA256 from 'crypto-js/sha256';

var initialization = {
    name: 'ID5',

    //To-Do: add Module id after establishing in QA
    moduleId: '',
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
    var SHA256 = require('crypto-js/sha256');

    // To-Do: finalize which PD values we are utilizing
    var email = userIdentities.userIdentities['email'];
    var cleansedEmail = normalizeEmail(email);
    var hashedEmail = SHA256(cleansedEmail);

    var phone = userIdentities.userIdentities['mobile_number'];
    var cleansedPhone = normalizePhone(phone);
    var hashedPhoneNumber = SHA256(cleansedPhone);

    var fullUrl = window.location.href;
    var deviceIPv4;
    var userAgentString;
    var idfv;

    var pdKeys = {
        1: hashedEmail,
        2: hashedPhoneNumber,
        8: encodeURIComponent(fullUrl),
        10: encodeURIComponent(deviceIPv4),
        12: encodeURIComponent(userAgentString),
        14: encodeURIComponent(idfv),
    }

    var pdRaw = Object.keys(pdKeys).map(function(key){
        return key + '=' + pdKeys[key]
    }).join('&');

    return btoa(pdRaw);
}

function normalizeEmail(email) {
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

function normalizePhone(phone) {
    var charactersToRemove = [' ', '-', '(', ')']
    charactersToRemove.forEach(function(character) {
        phone = phone.replaceAll(character, '');
    })
    return phone;
}

module.exports = initialization;
