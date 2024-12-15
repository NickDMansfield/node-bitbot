const { testRetroactively } = require('./runRetro');
var assert = require('assert');
const fs = require('fs');
const dict = require('../dict');

describe('Array', function () {
  describe('#indexOf()', function () {
    // it('should test against LTC', function () {

    //     const historyStr = fs.readFileSync('datasets/ltc_price_data_pct.json',
    //     { encoding: 'utf8', flag: 'r' });
    //     const mockHistory = JSON.parse(historyStr);
  
    //     const retroSettings = {
    //       initialLiquid: 10000,
    //       symbol: 'LTC',
    //       philosophy: 'safeSwing',
    //       initialSymbolAmount: 1,
    //       minimumProfitPercentToSell: 0.05,
    //       shortAdjustmentModifier: 0.99,
    //      // useCurrentPriceForAdjustment: true,
    //       periodicTransactions: [
    //         { orderType: dict.orderTypes.BUY, units: dict.units.USD, quantity: 10, period: dict.periods.DAILY }
    //       ]
    //     };
  
    //     const orderHistory = [];
  
    //     try{

    //       const result = testRetroactively(orderHistory, mockHistory, retroSettings);
    //       assert.ok(result);
    //       result.analyzedHistories = null
    //       console.log(result);
    //       assert.equal(result.totalGrowthPercent, 999);
    //     } catch (err) {
    //       assert.equal(1,2);
    //     }
    // });
    // it('should test against LTC with the current price modifier and a conservative minset', function () {

    //     const historyStr = fs.readFileSync('datasets/ltc_price_data_pct.json',
    //     { encoding: 'utf8', flag: 'r' });
    //     const mockHistory = JSON.parse(historyStr);
  
    //     const retroSettings = {
    //       initialLiquid: 10000,
    //       symbol: 'LTC',
    //       philosophy: 'safeSwing',
    //       initialSymbolAmount: 1,
    //       minimumProfitPercentToSell: 0.05,
    //       shortAdjustmentModifier: 0.90,
    //       useCurrentPriceForAdjustment: true,
    //       periodicTransactions: [
    //         { orderType: dict.orderTypes.BUY, units: dict.units.USD, quantity: 10, period: dict.periods.DAILY }
    //       ]
    //     };
  
    //     const orderHistory = [];
  
    //     try{

    //       const result = testRetroactively(orderHistory, mockHistory, retroSettings);
    //       assert.ok(result);
    //       result.analyzedHistories = null
    //       console.log(result);
    //       assert.equal(result.totalGrowthPercent, 999);
    //     } catch (err) {
    //       assert.equal(1,2);
    //     }
    // });
  //   it('should test against BTC', function () {

  //     const historyStr = fs.readFileSync('datasets/btc_price_data_pct.json',
  //     { encoding: 'utf8', flag: 'r' });
  //     const mockHistory = JSON.parse(historyStr);

  //     const retroSettings = {
  //       initialLiquid: 10000,
  //       symbol: 'BTC',
  //       philosophy: 'safeSwing',
  //       initialSymbolAmount: 0,
  //       minimumProfitPercentToSell: 0.01,
  //       shortAdjustmentModifier: 0.99,
  //       useCurrentPriceForAdjustment: true,
  //       periodicTransactions: [
  //         { orderType: dict.orderTypes.BUY, units: dict.units.USD, quantity: 5, period: dict.periods.DAILY }
  //       ]
  //     };

  //     const orderHistory = [];

  //     try{

  //       const result = testRetroactively(orderHistory, mockHistory, retroSettings);
  //       assert.ok(result);
  //       result.analyzedHistories = null
  //       console.log(result);
  //       assert.equal(result.totalGrowthPercent, 999);
  //     } catch (err) {
  //       assert.equal(1,2);
  //     }
  // });
});

describe('2-year profitable BTC', function() {

    it('should test against BTC', function () {

      const historyStr = fs.readFileSync('datasets/btc_hourly_data.json',
      { encoding: 'utf8', flag: 'r' });
      const mockHistory = JSON.parse(historyStr);

      const retroSettings = {
        initialLiquid: 10000,
        symbol: 'BTC',
        philosophy: 'safeSwing',
        initialSymbolAmount: 0,
        minimumProfitPercentToSell: 0.01,
        shortAdjustmentModifier: 0.99,
        periodicTransactions: [
          { orderType: dict.orderTypes.BUY, units: dict.units.USD, quantity: 5, period: dict.periods.DAILY }
        ]
      };

      const orderHistory = [];

      try{

        const result = testRetroactively(orderHistory, mockHistory, retroSettings);
        assert.ok(result);
        result.analyzedHistories = null
        console.log(result);
        // assert.equal(result.totalGrowthPercent, 999);
      } catch (err) {
        assert.equal(1,2);
      }
  });

  it('should test against BTC', function () {

    const historyStr = fs.readFileSync('datasets/btc_hourly_data_steady-profit.json',
    { encoding: 'utf8', flag: 'r' });
    const mockHistory = JSON.parse(historyStr);

    const retroSettings = {
      initialLiquid: 10000,
      symbol: 'BTC',
      philosophy: 'safeSwing',
      initialSymbolAmount: 0,
      minimumProfitPercentToSell: 0.01,
      shortAdjustmentModifier: 0.99,
      periodicTransactions: [
        { orderType: dict.orderTypes.BUY, units: dict.units.USD, quantity: 5, period: dict.periods.DAILY }
      ]
    };

    const orderHistory = [];

    try{

      const result = testRetroactively(orderHistory, mockHistory, retroSettings);
      assert.ok(result);
      result.analyzedHistories = null
      console.log(result);
      // assert.equal(result.totalGrowthPercent, 999);
    } catch (err) {
      assert.equal(1,2);
    }
});
})

  // describe('profitable DOGE', function () {
  //   it('should test against profitable DOGE with a 0.01/0.99 safeswing', function () {
  
  //       const historyStr = fs.readFileSync('datasets/doge_price_data_pct profitable.json',
  //       { encoding: 'utf8', flag: 'r' });
  //       const mockHistory = JSON.parse(historyStr);
  
  //       const retroSettings = {
  //         initialLiquid: 10000,
  //         symbol: 'BTC',
  //         philosophy: 'safeSwing',
  //         initialSymbolAmount: 0,
  //         minimumProfitPercentToSell: 0.01,
  //         shortAdjustmentModifier: 0.99,
  //         useCurrentPriceForAdjustment: false,
  //         periodicTransactions: [
  //           { orderType: dict.orderTypes.BUY, units: dict.units.USD, quantity: 5, period: dict.periods.DAILY }
  //         ]
  //       };
  
  //       const orderHistory = [];
  
  //       try{
  
  //         const result = testRetroactively(orderHistory, mockHistory, retroSettings);
  //         assert.ok(result);
  //         result.analyzedHistories = null
  //         console.log(result);
  //         //assert.equal(result.totalGrowthPercent, 999);
  //       } catch (err) {
  //         assert.equal(1,2);
  //       }
  //   });
  //   it('should test against profitable DOGE with a 0.02/0.98 safeswing', function () {
  
  //       const historyStr = fs.readFileSync('datasets/doge_price_data_pct profitable.json',
  //       { encoding: 'utf8', flag: 'r' });
  //       const mockHistory = JSON.parse(historyStr);
  
  //       const retroSettings = {
  //         initialLiquid: 10000,
  //         symbol: 'BTC',
  //         philosophy: 'safeSwing',
  //         initialSymbolAmount: 0,
  //         minimumProfitPercentToSell: 0.02,
  //         shortAdjustmentModifier: 0.98,
  //         useCurrentPriceForAdjustment: false,
  //         periodicTransactions: [
  //           { orderType: dict.orderTypes.BUY, units: dict.units.USD, quantity: 5, period: dict.periods.DAILY }
  //         ]
  //       };
  
  //       const orderHistory = [];
  
  //       try{
  
  //         const result = testRetroactively(orderHistory, mockHistory, retroSettings);
  //         assert.ok(result);
  //         result.analyzedHistories = null
  //         console.log(result);
  //         //assert.equal(result.totalGrowthPercent, 999);
  //       } catch (err) {
  //         assert.equal(1,2);
  //       }
  //   });
  //   it('should test against profitable DOGE with a 0.03/0.97 safeswing', function () {
  
  //       const historyStr = fs.readFileSync('datasets/doge_price_data_pct profitable.json',
  //       { encoding: 'utf8', flag: 'r' });
  //       const mockHistory = JSON.parse(historyStr);
  
  //       const retroSettings = {
  //         initialLiquid: 10000,
  //         symbol: 'BTC',
  //         philosophy: 'safeSwing',
  //         initialSymbolAmount: 0,
  //         minimumProfitPercentToSell: 0.03,
  //         shortAdjustmentModifier: 0.97,
  //         useCurrentPriceForAdjustment: false,
  //         periodicTransactions: [
  //           { orderType: dict.orderTypes.BUY, units: dict.units.USD, quantity: 5, period: dict.periods.DAILY }
  //         ]
  //       };
  
  //       const orderHistory = [];
  
  //       try{
  
  //         const result = testRetroactively(orderHistory, mockHistory, retroSettings);
  //         assert.ok(result);
  //         result.analyzedHistories = null
  //         console.log(result);
  //         // assert.equal(result.totalGrowthPercent, 999);
  //       } catch (err) {
  //         assert.equal(1,2);
  //       }
  //   });
  //   it('should test against profitable DOGE with a 0.1/0.99 safeswing', function () {
  
  //       const historyStr = fs.readFileSync('datasets/doge_price_data_pct profitable.json',
  //       { encoding: 'utf8', flag: 'r' });
  //       const mockHistory = JSON.parse(historyStr);
  
  //       const retroSettings = {
  //         initialLiquid: 10000,
  //         symbol: 'BTC',
  //         philosophy: 'safeSwing',
  //         initialSymbolAmount: 0,
  //         minimumProfitPercentToSell: 0.1,
  //         shortAdjustmentModifier: 0.99,
  //         useCurrentPriceForAdjustment: false,
  //         periodicTransactions: [
  //           { orderType: dict.orderTypes.BUY, units: dict.units.USD, quantity: 5, period: dict.periods.DAILY }
  //         ]
  //       };
  
  //       const orderHistory = [];
  
  //       try{
  
  //         const result = testRetroactively(orderHistory, mockHistory, retroSettings);
  //         assert.ok(result);
  //         result.analyzedHistories = null
  //         console.log(result);
  //         // assert.equal(result.totalGrowthPercent, 999);
  //       } catch (err) {
  //         assert.equal(1,2);
  //       }
  //   });
  // });
});