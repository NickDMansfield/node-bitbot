const { testRetroactively } = require('./runRetro');
var assert = require('assert');
const fs = require('fs');
const dict = require('../dict');

describe('Array', function () {
  describe('#indexOf()', function () {
    it('should test against LTC', function () {

        const historyStr = fs.readFileSync('datasets/ltc_price_data_pct3.json',
        { encoding: 'utf8', flag: 'r' });
        const mockHistory = JSON.parse(historyStr);
  
        const retroSettings = {
          initialLiquid: 10000,
          symbol: 'LTC',
          philosophy: 'safeSwing',
          initialSymbolAmount: 1,
          minimumProfitPercentToSell: 0.05,
          shortAdjustmentModifier: 0.99,
         // useCurrentPriceForAdjustment: true,
          periodicTransactions: [
            { orderType: dict.orderTypes.BUY, units: dict.units.USD, quantity: 10, period: dict.periods.DAILY }
          ]
        };
  
        const purchaseHistory = [];
  
        try{

          const result = testRetroactively(purchaseHistory, mockHistory, retroSettings);
          assert.ok(result);
          result.analyzedHistories = null
          console.log(result);
          assert.equal(result.totalGrowthPercent, 999);
        } catch (err) {
          assert.equal(1,2);
        }
    });
  });
});