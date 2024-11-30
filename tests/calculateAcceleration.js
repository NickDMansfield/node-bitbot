const funcs = require('../funcs/funcs')
var assert = require('assert');


describe('calculateAcceleration', function () {
  describe('Hourly tests', function () {
    it('should return proper calculations on profit', function () {
      const mockHistory = [
        { symbol: 'LTC', price: 200, createdAt: '2023-10-05T18:02:15.556595' },
        { symbol: 'LTC', price: 200.22, createdAt: '2023-10-05T19:02:15.556595' },
        { symbol: 'LTC', price: 206.40, createdAt: '2023-10-05T20:02:15.556595' },
        { symbol: 'LTC', price: 210.00, createdAt: '2023-10-05T21:02:15.556595' },
        { symbol: 'LTC', price: 215, createdAt: '2023-10-05T22:02:15.556595' }
      ];
      const expectedResults = {
        growthRate: 0.01875, // 1.5%
        totalGrowthPercent: 0.075, //7.5%
        totalGrowth: 15,
        totalTime: 4
      };
      const results = funcs.calculateAcceleration(mockHistory[0], mockHistory[4]);
      assert.equal(results.growthRate, expectedResults.growthRate);
      assert.equal(results.totalGrowthPercent, expectedResults.totalGrowthPercent);
      assert.equal(results.totalGrowth, expectedResults.totalGrowth);
      assert.equal(results.totalTime, expectedResults.totalTime);
    });

    it('should return proper calculations on loss', function () {
      const mockHistory = [
        { symbol: 'LTC', price: 200, createdAt: '2023-10-05T18:02:15.556595' },
        { symbol: 'LTC', price: 197.11, createdAt: '2023-10-05T19:02:15.556595' },
        { symbol: 'LTC', price: 180.40, createdAt: '2023-10-05T20:02:15.556595' },
        { symbol: 'LTC', price: 171.00, createdAt: '2023-10-05T21:02:15.556595' },
        { symbol: 'LTC', price: 150, createdAt: '2023-10-05T22:02:15.556595' }
      ];
      const expectedResults = {
        growthRate: -0.0625, // -2%
        totalGrowthPercent: -0.25, // -10%
        totalGrowth: -50,
        totalTime: 4
      };
      const results = funcs.calculateAcceleration(mockHistory[0], mockHistory[4]);
      assert.equal(results.growthRate, expectedResults.growthRate);
      assert.equal(results.totalGrowthPercent, expectedResults.totalGrowthPercent);
      assert.equal(results.totalGrowth, expectedResults.totalGrowth);
      assert.equal(results.totalTime, expectedResults.totalTime);
    });
  });
});