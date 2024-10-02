/* eslint-disable no-undef*/
describe('ID5 Forwarder', function () {
    // -------------------DO NOT EDIT ANYTHING BELOW THIS LINE-----------------------
    var MessageType = {
            SessionStart: 1,
            SessionEnd: 2,
            PageView: 3,
            PageEvent: 4,
            CrashReport: 5,
            OptOut: 6,
            AppStateTransition: 10,
            Profile: 14,
            Commerce: 16,
            Media: 20,
            UserAttributeChange: 17,
            UserIdentityChange: 18,
        },
        EventType = {
            Unknown: 0,
            Navigation: 1,
            Location: 2,
            Search: 3,
            Transaction: 4,
            UserContent: 5,
            UserPreference: 6,
            Social: 7,
            Other: 8,
            Media: 9,
            getName: function() {
                return 'blahblah';
            }
        },
        ProductActionType = {
            Unknown: 0,
            AddToCart: 1,
            RemoveFromCart: 2,
            Checkout: 3,
            CheckoutOption: 4,
            Click: 5,
            ViewDetail: 6,
            Purchase: 7,
            Refund: 8,
            AddToWishlist: 9,
            RemoveFromWishlist: 10
        },
        IdentityType = {
            Other: 0,
            CustomerId: 1,
            Facebook: 2,
            Twitter: 3,
            Google: 4,
            Microsoft: 5,
            Yahoo: 6,
            Email: 7,
            FacebookCustomAudienceId: 9,
            Other2: 10,
            Other3: 11,
            Other4: 12,
            Other5: 13,
            Other6: 14,
            Other7: 15,
            Other8: 16,
            Other9: 17,
            Other10: 18,
            MobileNumber: 19,
            PhoneNumber2: 20,
            PhoneNumber3: 21,
        },
        ReportingService = function () {
            var self = this;

            this.id = null;
            this.event = null;

            this.cb = function (forwarder, event) {
                self.id = forwarder.id;
                self.event = event;
            };

            this.reset = function () {
                this.id = null;
                this.event = null;
            };
        },
        reportService = new ReportingService();

// -------------------DO NOT EDIT ANYTHING ABOVE THIS LINE-----------------------
// -------------------START EDITING BELOW:-----------------------
// -------------------mParticle stubs - Add any additional stubbing to our methods as needed-----------------------
    var userAttributes = {};

    mParticle.Identity = {
        getCurrentUser: function() {
            return {
                getMPID: function() {
                    return '123';
                },
                setUserAttribute: function(key, value){
                    userAttributes[key]= value
                },
                getAllUserAttributes: function() {
                    return userAttributes;
                },

            };
        }
    };
    // -------------------START EDITING BELOW:-----------------------
    var MockID5Forwarder = function() {
        var self = this;

        // create properties for each type of event you want tracked, see below for examples
        this.trackCustomEventCalled = false;
        this.logPurchaseEventCalled = false;
        this.isInitialized = false;
        this.initCalled = false;
        this.getUserIdCalled = false;

        this.pd = null;
        this.partnerId = null;
        this.configurationOptions = null;

        // stub your different methods to ensure they are being called properly
        this.init = function(id5Options) {
            self.initCalled = true;
            self.partnerId = id5Options.partnerId;
            self.pd = id5Options.pd
            return this;
        };

        this.onAvailable = function(callback) {
            return callback
        };

        this.getUserId = function() {
            self.getUserIdCalled = true;
            return 'ID5*testtesttesttest'
        }
    };

    before(function () {

    });

    beforeEach(function() {
        window.ID5 = new MockID5Forwarder();
        // Include any specific settings that is required for initializing your SDK here
        var sdkSettings = {
            partnerId: 1234,
        };
        // You may require userAttributes or userIdentities to be passed into initialization
        var userAttributes = {
            color: 'green'
        };

        var userIdentities = [{
            Identity: 'customerId',
            Type: IdentityType.CustomerId
        }, {
            Identity: 'email',
            Type: IdentityType.Email
        }, {
            Identity: 'mobile_number',
            Type: IdentityType.MobileNumber
        }];


        // The third argument here is a boolean to indicate that the integration is in test mode to avoid loading any third party scripts. Do not change this value.
        mParticle.forwarder.init(sdkSettings, reportService.cb, true, null, userAttributes, userIdentities);
    });


    it ('should load the script into the document during initialization', function(done) {
        window.ID5 = new MockID5Forwarder();
        mParticle.forwarder.init({
            partnerId: 1234,
        });
        document.scripts[0].src.should.equal('https://cdn.id5-sync.com/api/1.0/id5-api.js');
        done();
    });

    describe('Common Functions', function() {
        it ('should log a user attribute when logId5 is called', function(done) {
            mParticle.forwarder.common.logId5Id("testId");

            var attributes = mParticle.Identity.getCurrentUser().getAllUserAttributes()

            attributes.ID5ID.should.exist;
            attributes.ID5ID.should.equal("testId")
            done();
        });

        it ('should build pd when buildPartnerData is called with a user', function(done) {
            var user = {
                getUserIdentities: function() {
                    return {
                        userIdentities: {
                            email: 'test@email.com',
                            phone: '123-456-7890',
                        }
                    }
                },
            };

            var pd = mParticle.forwarder.common.buildPartnerData(user)

            pd.should.exist;
            pd.should.equal('MT03MzA2MmQ4NzI5MjZjMmE1NTZmMTdiMzZmNTBlMzI4ZGRmOWJmZjlkNDAzOTM5YmQxNGI2YzNiN2Y1YTMzZmMy')
            done();
        });

        it ('should normalize an gmail when normalizeEmail is called', function(done) {
            var normalizedGmail = mParticle.forwarder.common.normalizeEmail('test+test.2@gmail.com');

            normalizedGmail.should.exist;
            normalizedGmail.should.equal('testtest2@gmail.com')
            done();
        });

        it ('should not normalize an non-gmail when normalizeEmail is called', function(done) {
            var normalizedOther = mParticle.forwarder.common.normalizeEmail('test+test.2@test.com');

            normalizedOther.should.exist;
            normalizedOther.should.equal('test+test.2@test.com');
            done();
        });

        it ('should normalize phone numbers when normalizePhone is called', function(done) {
            var normalizedPhone = mParticle.forwarder.common.normalizePhone('(123) 456-7890');

            normalizedPhone.should.exist;
            normalizedPhone.should.equal('1234567890');
            done();
        })
    })
});
