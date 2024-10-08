/* eslint-disable no-undef*/
describe('ID5 Forwarder', function () {
    // -------------------DO NOT EDIT ANYTHING BELOW THIS LINE-----------------------
    var ReportingService = function () {
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
    var MockID5 = function() {
        var self = this;

        // create properties for each type of event you want tracked, see below for examples
        this.trackCustomEventCalled = false;
        this.logPurchaseEventCalled = false;
        this.isInitialized = false;
        this.initCalled = false;
        this.numberOfInitsCalled = 0;
        this.getUserIdCalled = false;

        this.pd = null;
        this.partnerId = null;
        this.configurationOptions = null;

        // stub your different methods to ensure they are being called properly
        this.init = function(id5Options) {
            self.initCalled = true;
            self.numberOfInitsCalled += 1;
            self.partnerId = id5Options.partnerId;
            self.pd = id5Options.pd
            return this;
        };

        this.onAvailable = function(callback) {
            return callback(self)
        };

        this.getUserId = function() {
            self.getUserIdCalled = true;
            return 'ID5*testtesttesttest'
        }

        return self;
    };

    before(function () {

    });

    beforeEach(function() {
        window.ID5 = new MockID5();
        // Include any specific settings that is required for initializing your SDK here
        var sdkSettings = {
            partnerId: 1234,
        };

        // The third argument here is a boolean to indicate that the integration is in test mode to avoid loading any third party scripts. Do not change this value.
        mParticle.forwarder.init(sdkSettings, reportService.cb, true);
    });


    describe('Initialization', function() {
        it('should call ID5.init', function(done) {
            window.ID5.initCalled.should.equal(true);
            done();
        });

        it('should call getUserId', function(done) {
            window.ID5.getUserIdCalled.should.equal(true);
            done();
        });
    })

    describe('Identity Handling', function() {
        it('should call ID5.init twice on userLoginComplete', function(done){
            var user = {
                getUserIdentities: function () {
                    return {
                        userIdentities: {
                            email: 'test@email.com',
                        },
                    };
                },
            };
            mParticle.forwarder.onLoginComplete(user);

            window.ID5.numberOfInitsCalled.should.equal(2);
            done();
        });

        it('should call ID5.init twice on userLogoutComplete', function(done){
            var user = {
                getUserIdentities: function () {
                    return {
                        userIdentities: {
                            email: 'test@email.com',
                        },
                    };
                },
            };
            mParticle.forwarder.onLogoutComplete(user);

            window.ID5.numberOfInitsCalled.should.equal(2);
            done();
        });
    })


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
