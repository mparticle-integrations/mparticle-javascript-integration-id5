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
    mParticle.Identity = {
        getCurrentUser: function() {
            return {
                getMPID: function() {
                    return '123';
                }

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
            partnerId: '1234',
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


    it ('Initialization should load the script into the document', function(done) {
        mParticle.forwarder.init({
            partnerId: '1234',
        });
        document.scripts[0].src.should.equal('https://cdn.id5-sync.com/api/1.0/id5-api.js');
        done();
    });

    it ('should call ID5.init', function(done) {
        mParticle.forwarder.init({
            partnerId: '1234',
        });
        done();
    });

    it ('should build PD based on user identities and device IDs', function(done) {
        done();
    });

    it ('should only utilize known identities and device IDs to build PDs', function(done) {
        done();
    });

    it ('should normalize emails ending in "@gmail"', function(done) {
        done();
    });

    it ('should not normalize emails not ending in @gmail', function(done) {
        done();
    });

    it ('should normalize phone numbers by removing certain special characters', function(done) {
        done();
    });

    it ('should not remove special characters beyond the specified list', function(done){
        done()
    });

    it ('should assign the ID5 ID to the selected identity in the forwarder settings', function(done){
        done();
    });

    it ('should not assign the ID5 ID if a selected identity is missing in the forwarder settings', function(done) {
        done();
    });

    it('should log event', function(done) {
        // mParticle.forwarder.process({
        //     EventDataType: MessageType.PageEvent,
        //     EventName: 'Test Event',
        //     EventAttributes: {
        //         label: 'label',
        //         value: 200,
        //         category: 'category'
        //     }
        // });

        // window.MockID5Forwarder.eventProperties[0].label.should.equal('label');
        // window.MockID5Forwarder.eventProperties[0].value.should.equal(200);

        done();
    });

    it('should log page view', function(done) {
        // mParticle.forwarder.process({
        //     EventDataType: MessageType.PageView,
        //     EventName: 'test name',
        //     EventAttributes: {
        //         attr1: 'test1',
        //         attr2: 'test2'
        //     }
        // });
        //
        // window.MockID5Forwarder.trackCustomEventCalled.should.equal(true);
        // window.MockID5Forwarder.trackCustomName.should.equal('test name');
        // window.MockID5Forwarder.eventProperties[0].attr1.should.equal('test1');
        // window.MockID5Forwarder.eventProperties[0].attr2.should.equal('test2');

        done();
    });

    it('should log a product purchase commerce event', function(done) {
        // mParticle.forwarder.process({
        //     EventName: 'Test Purchase Event',
        //     EventDataType: MessageType.Commerce,
        //     EventCategory: EventType.ProductPurchase,
        //     ProductAction: {
        //         ProductActionType: ProductActionType.Purchase,
        //         ProductList: [
        //             {
        //                 Sku: '12345',
        //                 Name: 'iPhone 6',
        //                 Category: 'Phones',
        //                 Brand: 'iPhone',
        //                 Variant: '6',
        //                 Price: 400,
        //                 TotalAmount: 400,
        //                 CouponCode: 'coupon-code',
        //                 Quantity: 1
        //             }
        //         ],
        //         TransactionId: 123,
        //         Affiliation: 'my-affiliation',
        //         TotalAmount: 450,
        //         TaxAmount: 40,
        //         ShippingAmount: 10,
        //         CouponCode: null
        //     }
        // });
        //
        // window.MockID5Forwarder.trackCustomEventCalled.should.equal(true);
        // window.MockID5Forwarder.trackCustomName.should.equal('Purchase');
        //
        // window.MockID5Forwarder.eventProperties[0].Sku.should.equal('12345');
        // window.MockID5Forwarder.eventProperties[0].Name.should.equal('iPhone 6');
        // window.MockID5Forwarder.eventProperties[0].Category.should.equal('Phones');
        // window.MockID5Forwarder.eventProperties[0].Brand.should.equal('iPhone');
        // window.MockID5Forwarder.eventProperties[0].Variant.should.equal('6');
        // window.MockID5Forwarder.eventProperties[0].Price.should.equal(400);
        // window.MockID5Forwarder.eventProperties[0].TotalAmount.should.equal(400);
        // window.MockID5Forwarder.eventProperties[0].CouponCode.should.equal('coupon-code');
        // window.MockID5Forwarder.eventProperties[0].Quantity.should.equal(1);

        done();
    });

    it('should set customer id user identity on user identity change', function(done) {
        // var fakeUserStub = {
        //     getUserIdentities: function() {
        //         return {
        //             userIdentities: {
        //                 customerid: '123'
        //             }
        //         };
        //     },
        //     getMPID: function() {
        //         return 'testMPID';
        //     },
        //     setUserAttribute: function() {
        //
        //     },
        //     removeUserAttribute: function() {
        //
        //     }
        // };
        //
        // mParticle.forwarder.onUserIdentified(fakeUserStub);
        //
        // window.MockID5Forwarder.userId.should.equal('123');

        done();
    });
});
