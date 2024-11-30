const funcs = require('../funcs/funcs')
var assert = require('assert');
const big = require('big-js');


describe('calculateAccelerationForRange', function () {
  describe('Hourly tests', function () {
    it('should return proper calculations on profit', function () {
      const mockHistory = [
        { symbol: 'LTC', price: 200, createdAt: '2023-10-05T18:02:15.556595' },
        { symbol: 'LTC', price: 202.22, createdAt: '2023-10-05T19:02:15.556595' },
        { symbol: 'LTC', price: 206.40, createdAt: '2023-10-05T20:02:15.556595' },
        { symbol: 'LTC', price: 210.00, createdAt: '2023-10-05T21:02:15.556595' },
        { symbol: 'LTC', price: 215, createdAt: '2023-10-05T22:02:15.556595' }
      ];
      const expectedResults = [{
        growthRate: 0.015, // 1.5%
        totalGrowthPercent: 0.075, //7.5%
        totalGrowth: 15,
        totalTime: 5
      },
      {
        totalGrowth: 12.78,
        totalTime: 4
      },
      {
        totalGrowth: 8.60,
        totalTime: 3
      },
      {
        totalGrowth: 5,
        totalTime: 2
      }];
      const results = funcs.calculateAccelerationForRange(mockHistory);
      for (let idx in expectedResults) {
        let curResult = results[idx];
        // assert.equal(curResult.growthRate, expectedResults[idx].growthRate);
        // assert.equal(curResult.totalGrowthPercent, expectedResults[idx].totalGrowthPercent);
        assert.equal(curResult.totalGrowth.toFixed(8), expectedResults[idx].totalGrowth.toFixed(8));
        assert.equal(curResult.totalTime.toFixed(8), expectedResults[idx].totalTime.toFixed(8));
      }
    });

    it('should return proper calculations on loss', function () {
      const mockHistory = [
        { symbol: 'LTC', price: 220, createdAt: '2023-10-05T18:02:15.556595' },
        { symbol: 'LTC', price: 217.11, createdAt: '2023-10-05T19:02:15.556595' },
        { symbol: 'LTC', price: 210.40, createdAt: '2023-10-05T20:02:15.556595' },
        { symbol: 'LTC', price: 205.00, createdAt: '2023-10-05T21:02:15.556595' },
        { symbol: 'LTC', price: 200, createdAt: '2023-10-05T22:02:15.556595' }
      ];
      const expectedResults = [{
        growthRate: -0.02, // -2%
        totalGrowthPercent: -0.1, // -10%
        totalGrowth: -20,
        totalTime: 5
      },
      {
        totalGrowth: -17.11,
        totalTime: 4
      },
      {
        totalGrowth: -10.40,
        totalTime: 3
      },
      {
        totalGrowth: -5,
        totalTime: 2
      }];
      const results = funcs.calculateAccelerationForRange(mockHistory);
      for (let idx in expectedResults) {
        let curResult = results[idx];
        // assert.equal(curResult.growthRate.toFixed(8), expectedResults[idx].growthRate.toFixed(8));
        // assert.equal(curResult.totalGrowthPercent.toFixed(8), expectedResults[idx].totalGrowthPercent.toFixed(8));
        assert.equal(curResult.totalGrowth.toFixed(8), expectedResults[idx].totalGrowth.toFixed(8));
        assert.equal(curResult.totalTime.toFixed(8), expectedResults[idx].totalTime.toFixed(8));
      }
    });
  });
});