var assert = require('assert');
const exp = require('constants');
const safeSwing = require('../philosophies/safe-swing');

describe('SafeSwing', function () {
  describe('Failure states', function () {
    
    it('should throw an error when no processSettings are provided', function () {
      assert.throws(() => {
        safeSwing.processData(null, [], []); 
      }, Error('You must provide a processSettings arg object'));
    });
    
    it('should throw an error when no orderHistory is provided', function () {
      assert.throws(() => {
        safeSwing.processData({}, []); 
      }, Error('You must provide a orderHistory array arg'));
    });
    
    it('should throw an error when no priceHistory is provided', function () {
      assert.throws(() => {
        safeSwing.processData({}, null ,[]); 
      }, Error('You must provide a priceHistory array arg'));
    });
    
    it('should throw an error when a non-array priceHistory is provided', function () {
      assert.throws(() => {
        safeSwing.processData({}, 727 ,[]); 
      }, Error('You must provide a priceHistory array arg'));
    });
    
    it('should throw an error when a non-array orderHistory is provided', function () {
      assert.throws(() => {
        safeSwing.processData({}, [{}], 727); 
      }, Error('You must provide a orderHistory array arg'));
    });

  });
  describe('Success states', function() {
    it('should return proper values on a basic happy path', function () {
      
      const expectedResults = {
        shouldBuy: false,
        shouldSell: true,
        amountToBuy: 0,
        amountToSell: 2,
        // these should probably be run after the 'manual' transactions
        limitOrdersToSet: [
          { price: 51.5, symbol: 'LTC', amountToBuy: 2 }
        ],
        estimatedCost: 0,
        estimatedRevenue: 110,
        symbol: 'LTC',
      };
      
      const processSettings = {
        minimumProfitPercentToSell: .1,
        timeToEvaluate: '2023-10-06T22:02:15.556595',
        symbol: 'LTC',
      };

      const priceHistory = [
        { symbol: 'LTC', price: 54, createdAt: '2023-10-04T18:02:15.556595' },
        { symbol: 'LTC', price: 51.50, createdAt: '2023-10-05T18:02:15.556595' },
        { symbol: 'LTC', price: 55, createdAt: '2023-10-05T22:02:15.556595' }];

      const orderHistory = [
        { price: 75, quantity: 0.7 },
        { price: 75, quantity: 0.3 },
        { price: 25, quantity: 1 }
      ];

      const results = safeSwing.processData(processSettings, priceHistory, orderHistory);
      
      assert.equal(results.symbol, expectedResults.symbol);
      assert.equal(results.shouldBuy, expectedResults.shouldBuy);
      assert.equal(results.shouldSell, expectedResults.shouldSell);
      assert.equal(results.amountToBuy, expectedResults.amountToBuy);
      assert.equal(results.amountToSell, expectedResults.amountToSell);
      assert.equal(results.estimatedCost, expectedResults.estimatedCost);
      assert.equal(results.estimatedRevenue, expectedResults.estimatedRevenue);
      assert.equal(results.limitOrdersToSet.length, expectedResults.limitOrdersToSet.length);
      assert.equal(results.limitOrdersToSet[0].price, expectedResults.limitOrdersToSet[0].price);
      assert.equal(results.limitOrdersToSet[0].symbol, expectedResults.limitOrdersToSet[0].symbol);
      assert.equal(results.limitOrdersToSet[0].amountToBuy, expectedResults.limitOrdersToSet[0].amountToBuy);

    });
    
    it('should return proper values and generate a single limitOrder (purchase)', function () {
      
      const expectedResults = {
        shouldBuy: false,
        shouldSell: true,
        amountToBuy: 0,
        amountToSell: 2,
        // these should probably be run after the 'manual' transactions
        limitOrdersToSet: [
          { price: 49.5, symbol: 'LTC', amountToBuy: 2 }
        ],
        estimatedCost: 0,
        estimatedRevenue: 110,
        symbol: 'LTC',
      };
      
      const processSettings = {
        minimumProfitPercentToSell: .1,
        shortAdjustmentModifier: 0.99,
        timeToEvaluate: '2023-10-06T22:02:15.556595',
        symbol: 'LTC',
      };

      const priceHistory = [
        { symbol: 'LTC', price: 54, createdAt: '2023-10-05T18:02:15.556595' },
        { symbol: 'LTC', price: 55, createdAt: '2023-10-05T22:02:15.556595' }];

      const orderHistory = [
        { price: 75, quantity: 0.7 },
        { price: 75, quantity: 0.3 },
        { price: 25, quantity: 1 }
      ];

      const results = safeSwing.processData(processSettings, priceHistory, orderHistory);
      
      assert.equal(results.symbol, expectedResults.symbol);
      assert.equal(results.shouldBuy, expectedResults.shouldBuy);
      assert.equal(results.shouldSell, expectedResults.shouldSell);
      assert.equal(results.amountToBuy, expectedResults.amountToBuy);
      assert.equal(results.amountToSell, expectedResults.amountToSell);
      assert.equal(results.estimatedCost, expectedResults.estimatedCost);
      assert.equal(results.estimatedRevenue, expectedResults.estimatedRevenue);
      assert.equal(results.limitOrdersToSet.length, expectedResults.limitOrdersToSet.length);
      assert.equal(results.limitOrdersToSet[0].price, expectedResults.limitOrdersToSet[0].price);
      assert.equal(results.limitOrdersToSet[0].symbol, expectedResults.limitOrdersToSet[0].symbol);
      assert.equal(results.limitOrdersToSet[0].amountToBuy, expectedResults.limitOrdersToSet[0].amountToBuy);

    });
  })
});