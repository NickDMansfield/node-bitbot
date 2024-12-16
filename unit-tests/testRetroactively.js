const { testRetroactively } = require('../retroTesting/runRetro');
var assert = require('assert');
const dict = require('../dict');

describe('testRetroActively', function () {

  describe('Failure states', function () {
    
    it('should throw an error when no purchase history is provided', function () {
        assert.throws(() => {
          testRetroactively(); 
        }, Error('No orderHistoryForSymbol supplied'));
    });
    
    it('should throw an error when no price history is provided', function () {
        assert.throws(() => {
          testRetroactively([]); 
        }, Error('No priceHistoryToAnalyze supplied'));
    });
    
    describe('orderHistoryForSymbol failure states', function () {
      it('should throw an error when orderHistoryForSymbol is not an array', function () {
          assert.throws(() => {
            testRetroactively('this should not be an array ;)', [], {}); 
          }, Error('orderHistoryForSymbol must be an array'));
      });
    });
    
    describe('priceHistoryToAnalyze failure states', function () {
      it('should throw an error when priceHistoryToAnalyze is not an array', function () {
          assert.throws(() => {
            testRetroactively([], 'this should not be an array ;)', {}); 
          }, Error('priceHistoryToAnalyze must be an array'));
      });

      it('should throw an error when priceHistoryToAnalyze is empty', function () {
        assert.throws(() => {
          testRetroactively([], [], {}); 
        }, Error('priceHistoryToAnalyze must be an array with at least one item'));
      });
    });
    
    describe('retroSetting failure states', function () {
      it('should throw an error when no retro settings are provided', function () {
          assert.throws(() => {
            testRetroactively([], []); 
          }, Error('No retro settings supplied'));
      });

      it('should throw an error when the retro settings are an array', function () {
          assert.throws(() => {
            testRetroactively([], [], []); 
          }, Error('retroSettings must be an object'));
      });

      it('should throw an error when the retro settings are a string', function () {
          assert.throws(() => {
            testRetroactively([], [], 'obviously wrong value'); 
          }, Error('retroSettings must be an object'));
      });

      it('should throw an error when no initialLiquid is provided in the retro settings', function () {
        assert.throws(() => {
          testRetroactively([], [{}], {}); 
        }, Error('No initialLiquid value provided in retroSettings'));
      });

      it('should throw an error when no philosophy is provided in the retro settings', function () {
        assert.throws(() => {
          testRetroactively([], [{}], { initialLiquid: 10000, initialSymbolAmount: 0 }); 
        }, Error('retroSettings MUST have a philosophy string property'));
      });

      it('should throw an error when no initialSymbolAmount is provided in the retro settings', function () {
        assert.throws(() => {
          testRetroactively([], [{}], { initialLiquid: 10000 }); 
        }, Error('No initialSymbolAmount value provided in retroSettings'));
      });
  
    })
  });
  describe('Success states', function () {
    it('should have the correct output properties (simple happy path)', function () {

      // it is intentionally out of order, since the function is expected to handle unsorted records
      const mockHistory = [
        { symbol: 'LTC', price: 202, createdAt: '2023-10-05T20:02:15.556595' },
        { symbol: 'LTC', price: 203.00, createdAt: '2023-10-05T21:02:15.556595' },
        { symbol: 'LTC', price: 201, createdAt: '2023-10-05T19:02:15.556595' },
        { symbol: 'LTC', price: 230, createdAt: '2023-10-05T22:02:15.556595' },
        { symbol: 'LTC', price: 200, createdAt: '2023-10-05T18:02:15.556595' }
      ];

      const retroSettings = {
        initialLiquid: 10000,
        symbol: 'LTC',
        philosophy: 'safeSwing',
        initialSymbolAmount: 1,
        minimumProfitPercentToSell: 0.1,
        shortAdjustmentModifier: 0.99,
        periodicTransactions: [
          { orderType: dict.orderTypes.BUY, units: dict.units.USD, quantity: 10, period: dict.periods.DAILY }
        ]
      };

      const orderHistory = [
        { price: 199, quantity: 1, orderType: dict.orderTypes.BUY }
      ];

      const expectedOutput = {
        symbol: 'LTC',
        initialLiquid: 10000,
        initialPositions: [],
        initialPrice: 200,
        finalLiquid: 10235.658973944597,
        finalPrice: 230,
        symbolTotal: 0,
        symbolTotalInUSD: 0,
        totalGrowth: 35.658973944597165,
        totalGrowthPercent: 1.003
      };
      const result = testRetroactively(orderHistory, mockHistory, retroSettings);
      assert.equal(result.symbol, expectedOutput.symbol);
      assert.equal(result.initialLiquid, expectedOutput.initialLiquid);
      // assert.equal(result.initialPositions, expectedOutput.initialPositions);
      assert.equal(result.initialPrice, expectedOutput.initialPrice);
      assert.equal(result.finalLiquid, expectedOutput.finalLiquid);
      // assert.equal(result.finalPositions, expectedOutput.finalPositions);
      assert.equal(result.finalPrice, expectedOutput.finalPrice);
      assert.equal(result.symbolTotal, expectedOutput.symbolTotal);
      assert.equal(result.symbolTotalInUSD, expectedOutput.symbolTotalInUSD);
      assert.equal(result.totalGrowth, expectedOutput.totalGrowth);
      // This is to round up, since we get a wacky long decimal which just rounds to the approximate 1.003 anywho
      assert.equal(Math.round(result.totalGrowthPercent * 1000)/1000, expectedOutput.totalGrowthPercent);
    });

    it('should have the correct output properties for a test which generates and does not execute limitOrders', function () {
      // assert.equal(false, true);
      // TODO: Make sure it flags them as completed via the completedOn property

      // it is intentionally out of order, since the function is expected to handle unsorted records
      const mockHistory = [
        { symbol: 'LTC', price: 202, createdAt: '2023-10-05T20:02:15.556595' },
        { symbol: 'LTC', price: 203.00, createdAt: '2023-10-05T21:02:15.556595' },
        { symbol: 'LTC', price: 201, createdAt: '2023-10-05T19:02:15.556595' },
        { symbol: 'LTC', price: 230, createdAt: '2023-10-05T22:02:15.556595' },
        { symbol: 'LTC', price: 200, createdAt: '2023-10-05T18:02:15.556595' }
      ];

      const retroSettings = {
        initialLiquid: 10000,
        symbol: 'LTC',
        philosophy: 'safeSwing',
        initialSymbolAmount: 1,
        minimumProfitPercentToSell: 0.1,
        shortAdjustmentModifier: 0.99,
        periodicTransactions: [
          { orderType: dict.orderTypes.BUY, units: dict.units.USD, quantity: 10, period: dict.periods.DAILY }
        ]
      };

      const orderHistory = [
        { price: 199, quantity: 1, orderType: dict.orderTypes.BUY }
      ];

      const expectedOutput = {
        symbol: 'LTC',
        initialLiquid: 10000,
        initialPositions: [],
        initialPrice: 200,
        finalLiquid: 10235.658973944597,
        finalPrice: 230,
        symbolTotal: 0,
        symbolTotalInUSD: 0,
        totalGrowth: 35.658973944597165,
        totalGrowthPercent: 1.003
      };
      const result = testRetroactively(orderHistory, mockHistory, retroSettings);
      assert.equal(result.symbol, expectedOutput.symbol);
      assert.equal(result.initialLiquid, expectedOutput.initialLiquid);
      // assert.equal(result.initialPositions, expectedOutput.initialPositions);
      assert.equal(result.initialPrice, expectedOutput.initialPrice);
      assert.equal(result.finalLiquid, expectedOutput.finalLiquid);
      // assert.equal(result.finalPositions, expectedOutput.finalPositions);
      assert.equal(result.finalPrice, expectedOutput.finalPrice);
      assert.equal(result.symbolTotal, expectedOutput.symbolTotal);
      assert.equal(result.symbolTotalInUSD, expectedOutput.symbolTotalInUSD);
      assert.equal(result.totalGrowth, expectedOutput.totalGrowth);
      // This is to round up, since we get a wacky long decimal which just rounds to the approximate 1.003 anywho
      assert.equal(Math.round(result.totalGrowthPercent * 1000)/1000, expectedOutput.totalGrowthPercent);
    });

    it('should have the correct output properties for a test which generates and executes limitOrder sales using the weekly low and not hitting it', function () {
      // assert.equal(false, true);
      // TODO: Make sure it flags them as completed via the completedOn property

      // it is intentionally out of order, since the function is expected to handle unsorted records
      const mockHistory = [
        { symbol: 'LTC', price: 202, createdAt: '2023-10-05T20:02:15.556595' },
        { symbol: 'LTC', price: 203.00, createdAt: '2023-10-05T21:02:15.556595' },
        { symbol: 'LTC', price: 201, createdAt: '2023-10-05T19:02:15.556595' },
        { symbol: 'LTC', price: 230, createdAt: '2023-10-05T22:02:15.556595' },
        { symbol: 'LTC', price: 200, createdAt: '2023-10-05T18:02:15.556595' },
        { symbol: 'LTC', price: 192, createdAt: '2023-10-05T18:02:15.556595' },
        { symbol: 'LTC', price: 196, createdAt: '2023-10-05T23:02:15.556595' }
      ];

      const retroSettings = {
        initialLiquid: 10000,
        symbol: 'LTC',
        philosophy: 'safeSwing',
        initialSymbolAmount: 1,
        minimumProfitPercentToSell: 0.1,
        shortAdjustmentModifier: 0.99,
        periodicTransactions: [
          { orderType: dict.orderTypes.BUY, units: dict.units.USD, quantity: 10, period: dict.periods.DAILY }
        ]
      };

      const orderHistory = [
        { price: 199, quantity: 1, orderType: dict.orderTypes.BUY }
      ];

      const expectedOutput = {
        symbol: 'LTC',
        initialLiquid: 10000,
        initialPositions: [],
        initialPrice: 200,
        finalLiquid: 10227.638140611263,
        finalPrice: 196,
        symbolTotal: 0.05102040816326531,
        symbolTotalInUSD: 10,
        totalGrowth: 37.638140611263225,
        totalGrowthPercent: 1.004
      };
      const result = testRetroactively(orderHistory, mockHistory, retroSettings);
      assert.equal(result.symbol, expectedOutput.symbol);
      assert.equal(result.initialLiquid, expectedOutput.initialLiquid);
      // assert.equal(result.initialPositions, expectedOutput.initialPositions);
      assert.equal(result.initialPrice, expectedOutput.initialPrice);
      assert.equal(result.finalLiquid, expectedOutput.finalLiquid);
      // assert.equal(result.finalPositions, expectedOutput.finalPositions);
      assert.equal(result.finalPrice, expectedOutput.finalPrice);
      assert.equal(result.symbolTotal, expectedOutput.symbolTotal);
      assert.equal(result.symbolTotalInUSD, expectedOutput.symbolTotalInUSD);
      assert.equal(result.totalGrowth, expectedOutput.totalGrowth);
      // This is to round up, since we get a wacky long decimal which just rounds to the approximate 1.003 anywho
      assert.equal(Math.round(result.totalGrowthPercent * 1000)/1000, expectedOutput.totalGrowthPercent);
    });

    it('should have the correct output properties for a test which generates and executes limitOrder sales using the weekly low and hitting it', function () {
      // assert.equal(false, true);
      // TODO: Make sure it flags them as completed via the completedOn property

      // it is intentionally out of order, since the function is expected to handle unsorted records
      const mockHistory = [
        { symbol: 'LTC', price: 202, createdAt: '2023-10-05T20:02:15.556595' },
        { symbol: 'LTC', price: 203.00, createdAt: '2023-10-05T21:02:15.556595' },
        { symbol: 'LTC', price: 201, createdAt: '2023-10-05T19:02:15.556595' },
        { symbol: 'LTC', price: 230, createdAt: '2023-10-05T22:02:15.556595' },
        { symbol: 'LTC', price: 200, createdAt: '2023-10-05T18:02:15.556595' },
        { symbol: 'LTC', price: 192, createdAt: '2023-10-05T18:02:15.556595' },
        { symbol: 'LTC', price: 190, createdAt: '2023-10-05T23:02:15.556595' }
      ];

      const retroSettings = {
        initialLiquid: 10000,
        symbol: 'LTC',
        philosophy: 'safeSwing',
        initialSymbolAmount: 1,
        minimumProfitPercentToSell: 0.1,
        shortAdjustmentModifier: 0.99,
        periodicTransactions: [
          { orderType: dict.orderTypes.BUY, units: dict.units.USD, quantity: 10, period: dict.periods.DAILY }
        ]
      };

      const orderHistory = [
        { price: 199, quantity: 1, orderType: dict.orderTypes.BUY }
      ];

      const expectedOutput = {
        symbol: 'LTC',
        initialLiquid: 10000,
        initialPositions: [],
        initialPrice: 200,
        finalLiquid: 10227.638140611263,
        finalPrice: 190,
        symbolTotal: 0.05263157894736842,
        symbolTotalInUSD: 10,
        totalGrowth: 37.638140611263225,
        totalGrowthPercent: 1.004
      };
      const result = testRetroactively(orderHistory, mockHistory, retroSettings);
      assert.equal(result.symbol, expectedOutput.symbol);
      assert.equal(result.initialLiquid, expectedOutput.initialLiquid);
      // assert.equal(result.initialPositions, expectedOutput.initialPositions);
      assert.equal(result.initialPrice, expectedOutput.initialPrice);
      assert.equal(result.finalLiquid, expectedOutput.finalLiquid);
      // assert.equal(result.finalPositions, expectedOutput.finalPositions);
      assert.equal(result.finalPrice, expectedOutput.finalPrice);
      assert.equal(result.symbolTotal, expectedOutput.symbolTotal);
      assert.equal(result.symbolTotalInUSD, expectedOutput.symbolTotalInUSD);
      assert.equal(result.totalGrowth, expectedOutput.totalGrowth);
      // This is to round up, since we get a wacky long decimal which just rounds to the approximate 1.003 anywho
      assert.equal(Math.round(result.totalGrowthPercent * 1000)/1000, expectedOutput.totalGrowthPercent);
    });


    it('should have the correct output properties for a test which generates and executes limitOrder sales overriding the weekly low', function () {
      // assert.equal(false, true);
      // TODO: Make sure it flags them as completed via the completedOn property

      // it is intentionally out of order, since the function is expected to handle unsorted records
      const mockHistory = [
        { symbol: 'LTC', price: 202, createdAt: '2023-10-05T20:02:15.556595' },
        { symbol: 'LTC', price: 203.00, createdAt: '2023-10-05T21:02:15.556595' },
        { symbol: 'LTC', price: 201, createdAt: '2023-10-05T19:02:15.556595' },
        { symbol: 'LTC', price: 230, createdAt: '2023-10-05T22:02:15.556595' },
        { symbol: 'LTC', price: 200, createdAt: '2023-10-05T18:02:15.556595' },
        { symbol: 'LTC', price: 192, createdAt: '2023-10-05T18:02:15.556595' },
        { symbol: 'LTC', price: 196, createdAt: '2023-10-05T23:02:15.556595' }
      ];

      const retroSettings = {
        initialLiquid: 10000,
        symbol: 'LTC',
        philosophy: 'safeSwing',
        initialSymbolAmount: 1,
        minimumProfitPercentToSell: 0.1,
        shortAdjustmentModifier: 0.99,
        overrideWeeklyLow: true,
        periodicTransactions: [
          { orderType: dict.orderTypes.BUY, units: dict.units.USD, quantity: 10, period: dict.periods.DAILY }
        ]
      };

      const orderHistory = [
        { price: 199, quantity: 1, orderType: dict.orderTypes.BUY }
      ];

      const expectedOutput = {
        symbol: 'LTC',
        initialLiquid: 10000,
        initialPositions: [],
        initialPrice: 200,
        finalLiquid: 10227.638140611263,
        finalPrice: 196,
        symbolTotal: 0.05102040816326531,
        symbolTotalInUSD: 10,
        totalGrowth: 37.638140611263225,
        totalGrowthPercent: 1.004
      };
      const result = testRetroactively(orderHistory, mockHistory, retroSettings);
      assert.equal(result.symbol, expectedOutput.symbol);
      assert.equal(result.initialLiquid, expectedOutput.initialLiquid);
      // assert.equal(result.initialPositions, expectedOutput.initialPositions);
      assert.equal(result.initialPrice, expectedOutput.initialPrice);
      assert.equal(result.finalLiquid, expectedOutput.finalLiquid);
      // assert.equal(result.finalPositions, expectedOutput.finalPositions);
      assert.equal(result.finalPrice, expectedOutput.finalPrice);
      assert.equal(result.symbolTotal, expectedOutput.symbolTotal);
      assert.equal(result.symbolTotalInUSD, expectedOutput.symbolTotalInUSD);
      assert.equal(result.totalGrowth, expectedOutput.totalGrowth);
      // This is to round up, since we get a wacky long decimal which just rounds to the approximate 1.003 anywho
      assert.equal(Math.round(result.totalGrowthPercent * 1000)/1000, expectedOutput.totalGrowthPercent);
    });

  });
});