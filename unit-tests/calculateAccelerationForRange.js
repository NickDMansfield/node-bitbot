const funcs = require('../funcs/funcs')
var assert = require('assert');
const big = require('big-js');


describe('calculateAccelerationForRange', function () {
  
  describe('Failure states', function () {

    it('should throw an error when no historyRecords are provided', function () {
      assert.throws(() => {
        funcs.calculateAccelerationForRange();
      }, Error('You must submit an array with at least two historical price records'));
    });

    it('should throw an error when only one historyRecords is provided', function () {
      assert.throws(() => {
        funcs.calculateAccelerationForRange([{ symbol: 'LTC', price: 55.22, createdAt: '2023-10-05T18:02:15.556595' }]);
      }, Error('You must submit an array with at least two historical price records'));
    });

    it('should throw an error when no historyRecords are provided', function () {
      assert.throws(() => {
        funcs.calculateAccelerationForRange([]);
      }, Error('You must submit an array with at least two historical price records'));
    });

  });

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
        growthRate: 0.01875, // 1.5%
        totalGrowthPercent: 0.075, //7.5%
        totalGrowth: 15,
        totalTime: 4
      },
      {
        growthRate: 0.02106617,
        totalGrowthPercent: 0.06319850,
        totalGrowth: 12.78,
        totalTime: 3
      },
      {
        growthRate: 0.02083333,
        totalGrowthPercent: 0.04166667,
        totalGrowth: 8.60,
        totalTime: 2
      },
      {
        growthRate: 0.02380952,
        totalGrowthPercent: 0.02380952,
        totalGrowth: 5,
        totalTime: 1
      }];
      const results = funcs.calculateAccelerationForRange(mockHistory);
      for (let idx in expectedResults) {
        let curResult = results[idx];
        assert.equal(curResult.growthRate.toFixed(8), expectedResults[idx].growthRate.toFixed(8));
        assert.equal(curResult.totalGrowthPercent.toFixed(8), expectedResults[idx].totalGrowthPercent.toFixed(8));
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
        { symbol: 'LTC', price: 198, createdAt: '2023-10-05T22:02:15.556595' }
      ];
      const expectedResults = [{
        growthRate: -0.025, // -2%
        totalGrowthPercent: -0.1, // -10%
        totalGrowth: -22,
        totalTime: 4
      },
      {
        growthRate: -0.02933997,
        totalGrowthPercent: -0.08801990,
        totalGrowth: -19.11,
        totalTime: 3
      },
      {
        growthRate: -0.02946768,
        totalGrowthPercent: -0.05893536,
        totalGrowth: -12.40,
        totalTime: 2
      },
      {
        growthRate: -0.03414634,
        totalGrowthPercent: -0.03414634,
        totalGrowth: -7,
        totalTime: 1
      }];
      const results = funcs.calculateAccelerationForRange(mockHistory);
      for (let idx in expectedResults) {
        let curResult = results[idx];
        assert.equal(curResult.growthRate.toFixed(8), expectedResults[idx].growthRate.toFixed(8));
        assert.equal(curResult.totalGrowthPercent.toFixed(8), expectedResults[idx].totalGrowthPercent.toFixed(8));
        assert.equal(curResult.totalGrowth.toFixed(8), expectedResults[idx].totalGrowth.toFixed(8));
        assert.equal(curResult.totalTime.toFixed(8), expectedResults[idx].totalTime.toFixed(8));
      }
    });
  });
});