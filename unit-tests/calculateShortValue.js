
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
        funcs.calculateShortValue([], { currentPrice: 7.77 });
      }, Error('No processSettings.averagePrice provided'));
    });
    it('should throw an error if there is no processSettings.currentPrice', function () {
      assert.throws(() => {
        funcs.calculateShortValue([], { averagePrice: 13.37 });
      }, Error('No processSettings.currentPrice provided'));
    });
    it('should throw an error if the currentPrice is less than the average price and enableSuicideShorts is not enabled', function () {
      assert.throws(() => {
        funcs.calculateShortValue([], { averagePrice: 13.37, currentPrice: 5.15 });
      }, Error('An attempt to calculate a suicide short was made. Set enableSuicideShorts to true in the processSettings to bypass this'));
    });
  });

  describe('Success States', function () {
    it('should return the correct values on a simple execution', function () {
      const priceHistory = [];
      const processSettings = {

      };
      const shortPrice = funcs.calculateShortValue(priceHistory, processSettings);
    });
    it('should return the correct values when overrideWeeklyLow is on', function () {
      assert.equal([1, 2, 3].indexOf(4), 99);
    });

    it('should return the correct values when the weeklyLow is < shortReductionPercentAdjustedBuyPrice', function () {
      assert.equal([1, 2, 3].indexOf(4), 99);
    });
    it('should return the correct values when the weeklyLow is > shortReductionPercentAdjustedBuyPrice', function () {
      assert.equal([1, 2, 3].indexOf(4), 99);
    });
    it('should return the correct values when the weeklyLow is equal to shortReductionPercentAdjustedBuyPrice', function () {
      assert.equal([1, 2, 3].indexOf(4), 99);
    });
  });
});