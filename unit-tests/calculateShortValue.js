
var assert = require('assert');
const funcs = require('../funcs/funcs.js');

describe('calculateShortValue', function () {
  describe('Failure States', function () {
    it('should throw an error if there is no priceHistory', function () {
      assert.throws(() => {
        funcs.calculateShortValue();
      }, Error('No priceHistory arg provided'));
    });
    it('should throw an error if there is no processSettings', function () {
      assert.throws(() => {
        funcs.calculateShortValue([]);
      }, Error('No processSettings arg provided'));
    });
    it('should throw an error if there is no processSettings.averagePrice', function () {
      assert.throws(() => {
        funcs.calculateShortValue([], { currentPrice: 7.77, timeToEvaluate: '2023-10-02T18:02:15.556595' });
      }, Error('No processSettings.averagePrice provided'));
    });
    it('should throw an error if there is no processSettings.timeToEvaluate', function () {
      assert.throws(() => {
        funcs.calculateShortValue([], { currentPrice: 7.77, averagePrice: 11.34 });
      }, Error('No processSettings.timeToEvaluate provided'));
    });
    it('should throw an error if there is no processSettings.currentPrice', function () {
      assert.throws(() => {
        funcs.calculateShortValue([], { averagePrice: 13.37, timeToEvaluate: '2023-10-02T18:02:15.556595' });
      }, Error('No processSettings.currentPrice provided'));
    });
    it('should throw an error if there is a non-numeric processSettings.currentPrice', function () {
      assert.throws(() => {
        funcs.calculateShortValue([], { averagePrice: 13.37, currentPrice: 'hello', timeToEvaluate: '2023-10-02T18:02:15.556595' });
      }, Error('processSettings.currentPrice must be a number'));
    });
    it('should throw an error if there is a non-numeric processSettings.averagePrice', function () {
      assert.throws(() => {
        funcs.calculateShortValue([], { averagePrice: 'I am not a number!' ,currentPrice: 13.37, timeToEvaluate: '2023-10-02T18:02:15.556595' });
      }, Error('processSettings.averagePrice must be a number'));
    });
    it('should throw an error if the currentPrice is less than the average price and enableSuicideShorts is not enabled', function () {
      assert.throws(() => {
        funcs.calculateShortValue([], { averagePrice: 13.37, currentPrice: 5.15, timeToEvaluate: '2023-10-02T18:02:15.556595' });
      }, Error('An attempt to calculate a suicide short was made. Set enableSuicideShorts to true in the processSettings to bypass this'));
    });
  });

  describe('Success States', function () {
    it('should return the correct values on a simple execution when useCurrentPriceForAdjustment is false', function () {
      const priceHistory = [
        { symbol: 'LTC', price: 202, createdAt: '2023-10-02T18:02:15.556595' },
        { symbol: 'LTC', price: 203, createdAt: '2023-10-03T18:02:15.556595' },
        { symbol: 'LTC', price: 201, createdAt: '2023-10-01T18:02:15.556595' },
        { symbol: 'LTC', price: 230, createdAt: '2023-10-05T18:02:15.556595' },
        { symbol: 'LTC', price: 200.50, createdAt: '2023-10-04T18:02:15.556595' }
      ];
      const processSettings = {
        averagePrice: 200,
        currentPrice : 230,
        timeToEvaluate: '2023-10-06T18:00:15.556595',
        shortAdjustmentModifier: 0.99 // 99%
      };
      const shortPrice = funcs.calculateShortValue(priceHistory, processSettings);
      assert.equal(198, shortPrice);
    });

    it('should return the correct values on a simple execution when useCurrentPriceForAdjustment is true', function () {
      const priceHistory = [
        { symbol: 'LTC', price: 230, createdAt: '2023-10-02T18:02:15.556595' },
        { symbol: 'LTC', price: 232, createdAt: '2023-10-03T18:02:15.556595' },
        { symbol: 'LTC', price: 229, createdAt: '2023-10-01T18:02:15.556595' },
        { symbol: 'LTC', price: 230, createdAt: '2023-10-05T18:02:15.556595' },
        { symbol: 'LTC', price: 234, createdAt: '2023-10-04T18:02:15.556595' }
      ];
      const processSettings = {
        averagePrice: 200,
        currentPrice : 230,
        timeToEvaluate: '2023-10-06T18:00:15.556595',
        useCurrentPriceForAdjustment: true,
        shortAdjustmentModifier: 0.99 // 99%
      };
      const shortPrice = funcs.calculateShortValue(priceHistory, processSettings);
      assert.equal(227.7, shortPrice);
    });

    it('should return the correct values on a simple execution when useCurrentPriceForAdjustment is true and the average price is the same as the weeklyLow', function () {
      const priceHistory = [
        { symbol: 'LTC', price: 202, createdAt: '2023-10-02T18:02:15.556595' },
        { symbol: 'LTC', price: 203, createdAt: '2023-10-03T18:02:15.556595' },
        { symbol: 'LTC', price: 201, createdAt: '2023-10-01T18:02:15.556595' },
        { symbol: 'LTC', price: 199, createdAt: '2023-10-05T18:02:15.556595' },
        { symbol: 'LTC', price: 200, createdAt: '2023-10-04T18:02:15.556595' }
      ];
      const processSettings = {
        averagePrice: 175,
        currentPrice : 199,
        timeToEvaluate: '2023-10-06T18:00:15.556595',
        useCurrentPriceForAdjustment: true,
        shortAdjustmentModifier: 0.99 // 99%
      };
      const shortPrice = funcs.calculateShortValue(priceHistory, processSettings);
      assert.equal(197.01, shortPrice);
    });

    it('should return the correct values on a simple execution when useCurrentPriceForAdjustment is true and the average price is the same as the weeklyLow, and overrideWeeklyLow is false', function () {
      const priceHistory = [
        { symbol: 'LTC', price: 202, createdAt: '2023-10-02T18:02:15.556595' },
        { symbol: 'LTC', price: 203, createdAt: '2023-10-03T18:02:15.556595' },
        { symbol: 'LTC', price: 201, createdAt: '2023-10-01T18:02:15.556595' },
        { symbol: 'LTC', price: 230, createdAt: '2023-10-05T18:02:15.556595' },
        { symbol: 'LTC', price: 200, createdAt: '2023-10-04T18:02:15.556595' }
      ];
      const processSettings = {
        averagePrice: 200,
        currentPrice : 230,
        timeToEvaluate: '2023-10-06T18:00:15.556595',
        useCurrentPriceForAdjustment: true,
        shortAdjustmentModifier: 0.99 // 99%
      };
      const shortPrice = funcs.calculateShortValue(priceHistory, processSettings);
      //  This is 200 because the weeklyLow is not overridden
      assert.equal(200, shortPrice);
    });

    it('should not count a very low number in the weeklyLow when it is out of range', function () {
      const priceHistory = [
        { symbol: 'LTC', price: 202, createdAt: '2023-10-02T18:02:15.556595' },
        { symbol: 'LTC', price: 203, createdAt: '2023-10-03T18:02:15.556595' },
        { symbol: 'LTC', price: 201, createdAt: '2023-10-01T18:02:15.556595' },
        { symbol: 'LTC', price: 230, createdAt: '2023-10-05T18:02:15.556595' },
        { symbol: 'LTC', price: 200, createdAt: '2023-10-04T18:02:15.556595' },
        { symbol: 'LTC', price: 110, createdAt: '2023-09-15T18:02:15.556595' }
      ];
      const processSettings = {
        averagePrice: 200,
        currentPrice : 230,
        timeToEvaluate: '2023-10-06T18:00:15.556595',
        shortAdjustmentModifier: 0.99 // 99%
      };
      const shortPrice = funcs.calculateShortValue(priceHistory, processSettings);
      assert.equal(198, shortPrice);
    });

    it('should return the correct values when the weeklyLow is < shortReductionPercentAdjustedBuyPrice and overrideWeeklyLow is false', function () {
      const priceHistory = [
        { symbol: 'LTC', price: 202, createdAt: '2023-10-02T18:02:15.556595' },
        { symbol: 'LTC', price: 195, createdAt: '2023-10-03T18:02:15.556595' },
        { symbol: 'LTC', price: 201, createdAt: '2023-10-01T18:02:15.556595' },
        { symbol: 'LTC', price: 230, createdAt: '2023-10-05T18:02:15.556595' },
        { symbol: 'LTC', price: 200, createdAt: '2023-10-04T18:02:15.556595' },
      ];
      const processSettings = {
        averagePrice: 200,
        currentPrice : 230,
        timeToEvaluate: '2023-10-06T18:00:15.556595',
        shortAdjustmentModifier: 0.99 // 99%
      };
      const shortPrice = funcs.calculateShortValue(priceHistory, processSettings);
      assert.equal(195, shortPrice);
    });
    it('should return the correct values when the weeklyLow is > shortReductionPercentAdjustedBuyPrice and overrideWeeklyLow is false', function () {
      const priceHistory = [
        { symbol: 'LTC', price: 202, createdAt: '2023-10-02T18:02:15.556595' },
        { symbol: 'LTC', price: 200, createdAt: '2023-10-03T18:02:15.556595' },
        { symbol: 'LTC', price: 201, createdAt: '2023-10-01T18:02:15.556595' },
        { symbol: 'LTC', price: 230, createdAt: '2023-10-05T18:02:15.556595' },
        { symbol: 'LTC', price: 200, createdAt: '2023-10-04T18:02:15.556595' },
      ];
      const processSettings = {
        averagePrice: 200,
        currentPrice : 230,
        timeToEvaluate: '2023-10-06T18:00:15.556595',
        shortAdjustmentModifier: 0.99 // 99%
      };
      const shortPrice = funcs.calculateShortValue(priceHistory, processSettings);
      assert.equal(198, shortPrice);
    });
    it('should return the correct values when the weeklyLow is equal to shortReductionPercentAdjustedBuyPrice and overrideWeeklyLow is false', function () {
      const priceHistory = [
        { symbol: 'LTC', price: 202, createdAt: '2023-10-02T18:02:15.556595' },
        { symbol: 'LTC', price: 198, createdAt: '2023-10-03T18:02:15.556595' },
        { symbol: 'LTC', price: 201, createdAt: '2023-10-01T18:02:15.556595' },
        { symbol: 'LTC', price: 230, createdAt: '2023-10-05T18:02:15.556595' },
        { symbol: 'LTC', price: 200, createdAt: '2023-10-04T18:02:15.556595' },
      ];
      const processSettings = {
        averagePrice: 200,
        currentPrice : 230,
        timeToEvaluate: '2023-10-06T18:00:15.556595',
        shortAdjustmentModifier: 0.99 // 99%
      };
      const shortPrice = funcs.calculateShortValue(priceHistory, processSettings);
      assert.equal(198, shortPrice);
    });


    it('should return the correct values when the weeklyLow is < shortReductionPercentAdjustedBuyPrice and overrideWeeklyLow is true', function () {
      const priceHistory = [
        { symbol: 'LTC', price: 202, createdAt: '2023-10-02T18:02:15.556595' },
        { symbol: 'LTC', price: 195, createdAt: '2023-10-03T18:02:15.556595' },
        { symbol: 'LTC', price: 201, createdAt: '2023-10-01T18:02:15.556595' },
        { symbol: 'LTC', price: 230, createdAt: '2023-10-05T18:02:15.556595' },
        { symbol: 'LTC', price: 200, createdAt: '2023-10-04T18:02:15.556595' },
      ];
      const processSettings = {
        averagePrice: 200,
        currentPrice : 230,
        overrideWeeklyLow: true,
        timeToEvaluate: '2023-10-06T18:00:15.556595',
        shortAdjustmentModifier: 0.99 // 99%
      };
      const shortPrice = funcs.calculateShortValue(priceHistory, processSettings);
      assert.equal(198, shortPrice);
    });
    it('should return the correct values when the weeklyLow is > shortReductionPercentAdjustedBuyPrice and overrideWeeklyLow is true', function () {
      const priceHistory = [
        { symbol: 'LTC', price: 202, createdAt: '2023-10-02T18:02:15.556595' },
        { symbol: 'LTC', price: 200, createdAt: '2023-10-03T18:02:15.556595' },
        { symbol: 'LTC', price: 201, createdAt: '2023-10-01T18:02:15.556595' },
        { symbol: 'LTC', price: 230, createdAt: '2023-10-05T18:02:15.556595' },
        { symbol: 'LTC', price: 200, createdAt: '2023-10-04T18:02:15.556595' },
      ];
      const processSettings = {
        averagePrice: 195,
        currentPrice : 230,
        overrideWeeklyLow: true,
        timeToEvaluate: '2023-10-06T18:00:15.556595',
        shortAdjustmentModifier: 0.99 // 99%
      };
      const shortPrice = funcs.calculateShortValue(priceHistory, processSettings);
      assert.equal(193.05, shortPrice);
    });
    it('should return the correct values when the weeklyLow is equal to shortReductionPercentAdjustedBuyPrice and overrideWeeklyLow is true', function () {
      const priceHistory = [
        { symbol: 'LTC', price: 202, createdAt: '2023-10-02T18:02:15.556595' },
        { symbol: 'LTC', price: 195, createdAt: '2023-10-03T18:02:15.556595' },
        { symbol: 'LTC', price: 201, createdAt: '2023-10-01T18:02:15.556595' },
        { symbol: 'LTC', price: 230, createdAt: '2023-10-05T18:02:15.556595' },
        { symbol: 'LTC', price: 200, createdAt: '2023-10-04T18:02:15.556595' },
      ];
      const processSettings = {
        averagePrice: 200,
        currentPrice : 230,
        overrideWeeklyLow: true,
        timeToEvaluate: '2023-10-06T18:00:15.556595',
        shortAdjustmentModifier: 0.99 // 99%
      };
      const shortPrice = funcs.calculateShortValue(priceHistory, processSettings);
      assert.equal(198, shortPrice);
    });
  });
});