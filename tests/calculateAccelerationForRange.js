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
        growthRate: 0.0158,
        totalGrowthPercent: 0.0632,
        totalGrowth: 12.78,
        totalTime: 4
      },
      {
        growthRate: 0.0139,
        totalGrowthPercent: 0.0417,
        totalGrowth: 8.60,
        totalTime: 3
      },
      {
        growthRate: 0.0119,
        totalGrowthPercent: 0.0238,
        totalGrowth: 5,
        totalTime: 2
      }];
      const results = funcs.calculateAccelerationForRange(mockHistory);
      for (let idx in expectedResults) {
        let curResult = results[idx];
        assert.equal(curResult.growthRate.toFixed(4), expectedResults[idx].growthRate.toFixed(4));
        assert.equal(curResult.totalGrowthPercent.toFixed(4), expectedResults[idx].totalGrowthPercent.toFixed(4));
        assert.equal(curResult.totalGrowth.toFixed(4), expectedResults[idx].totalGrowth.toFixed(4));
        assert.equal(curResult.totalTime.toFixed(4), expectedResults[idx].totalTime.toFixed(4));
      }
    });

    it('should return proper calculations on loss', function () {
      const mockHistory = [
        { symbol: 'LTC', price: 220, createdAt: '2023-10-05T18:02:15.556595' },
        { symbol: 'LTC', price: 217.11, createdAt: '2023-10-05T19:02:15.556595' },
        { symbol: 'LTC', price: 210.40, createdAt: '2023-10-05T20:02:15.556595' },
        { symbol: 'LTC', price: 205.00, createdAt: '2023-10-05T21:02:15.556595' },
        { symbol: 'LTC', price: 198, createdAt: '2023-10-05T22:02:15.556595' }
      ];
      const expectedResults = [{
        growthRate: -0.02, // -2%
        totalGrowthPercent: -0.1, // -10%
        totalGrowth: -22,
        totalTime: 5
      },
      {
        growthRate: -0.022,
        totalGrowthPercent: -0.088,
        totalGrowth: -19.11,
        totalTime: 4
      },
      {
        growthRate: -0.0196,
        totalGrowthPercent: -0.0589,
        totalGrowth: -12.40,
        totalTime: 3
      },
      {
        growthRate: -0.0171,
        totalGrowthPercent: -0.0341,
        totalGrowth: -7,
        totalTime: 2
      }];
      const results = funcs.calculateAccelerationForRange(mockHistory);
      for (let idx in expectedResults) {
        let curResult = results[idx];
        assert.equal(curResult.growthRate.toFixed(4), expectedResults[idx].growthRate.toFixed(4));
        assert.equal(curResult.totalGrowthPercent.toFixed(4), expectedResults[idx].totalGrowthPercent.toFixed(4));
        assert.equal(curResult.totalGrowth.toFixed(4), expectedResults[idx].totalGrowth.toFixed(4));
        assert.equal(curResult.totalTime.toFixed(4), expectedResults[idx].totalTime.toFixed(4));
      }
    });
  });
});