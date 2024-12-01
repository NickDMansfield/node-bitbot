const funcs = require('../funcs/funcs')
var assert = require('assert');


describe('calculateAcceleration', function () {
  describe('Hourly tests', function () {
    it('should return proper calculations on profit', function () {
      const mockHistory = [
        { symbol: 'LTC', price: 200, createdAt: '2023-10-05T18:02:15.556595' },
        { symbol: 'LTC', price: 215, createdAt: '2023-10-05T22:02:15.556595' }
      ];
      const expectedResults = {
        growthRate: 0.01875, // 1.5%
        totalGrowthPercent: 0.075, //7.5%
        totalGrowth: 15,
        totalTime: 4
      };
      const results = funcs.calculateAcceleration(mockHistory[0], mockHistory[1]);
      analyzeResults(results, expectedResults);
    });

    it('should return proper calculations on a BIG profit', function () {
      const mockHistory = [
        { symbol: 'LTC', price: 100, createdAt: '2023-10-05T18:02:15.556595' },
        { symbol: 'LTC', price: 400, createdAt: '2023-10-05T20:02:15.556595' }
      ];
      const expectedResults = {
        growthRate: 1.50,
        totalGrowthPercent: 3.00, //300%
        totalGrowth: 300,
        totalTime: 2
      };
      const results = funcs.calculateAcceleration(mockHistory[0], mockHistory[1]);
      analyzeResults(results, expectedResults);
    });

    it('should return proper calculations on a simple profit', function () {
      const mockHistory = [
        { symbol: 'LTC', price: 100, createdAt: '2023-10-05T18:02:15.556595' },
        { symbol: 'LTC', price: 110, createdAt: '2023-10-05T19:02:15.556595' }
      ];
      const expectedResults = {
        growthRate: 0.1,
        totalGrowthPercent: 0.1,
        totalGrowth: 10,
        totalTime: 1
      };
      const results = funcs.calculateAcceleration(mockHistory[0], mockHistory[1]);
      analyzeResults(results, expectedResults);
    });

    it('should return proper calculations on loss', function () {
      const mockHistory = [
        { symbol: 'LTC', price: 200, createdAt: '2023-10-05T18:02:15.556595' },
        { symbol: 'LTC', price: 150, createdAt: '2023-10-05T22:02:15.556595' }
      ];
      const expectedResults = {
        growthRate: -0.0625, // -2%
        totalGrowthPercent: -0.25, // -10%
        totalGrowth: -50,
        totalTime: 4
      };
      const results = funcs.calculateAcceleration(mockHistory[0], mockHistory[1]);
      analyzeResults(results, expectedResults);
    });

    it('should return proper calculations on a simple loss', function () {
      const mockHistory = [
        { symbol: 'LTC', price: 100, createdAt: '2023-10-05T18:02:15.556595' },
        { symbol: 'LTC', price: 90, createdAt: '2023-10-05T19:02:15.556595' }
      ];
      const expectedResults = {
        growthRate: -0.1,
        totalGrowthPercent: -0.1,
        totalGrowth: -10,
        totalTime: 1
      };
      const results = funcs.calculateAcceleration(mockHistory[0], mockHistory[1]);
      analyzeResults(results, expectedResults);
    });

  });
});

const analyzeResults = (results, expectedResults) => {
  assert.equal(results.growthRate, expectedResults.growthRate);
  assert.equal(results.totalGrowthPercent, expectedResults.totalGrowthPercent);
  assert.equal(results.totalGrowth, expectedResults.totalGrowth);
  assert.equal(results.totalTime, expectedResults.totalTime);
}