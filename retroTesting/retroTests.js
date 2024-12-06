const { testRetroactively } = require('./runRetro');
var assert = require('assert');
const fs = require('fs');
const dict = require('../dict');

describe('Array', function () {
  describe('#indexOf()', function () {
    it('should return -1 when the value is not present', function () {

        const historyStr = fs.readFileSync('../datasets/ltc_price_data_pct.json',
        { encoding: 'utf8', flag: 'r' });
        const mockHistory = JSON.parse(historyStr);
  
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
  
        const purchaseHistory = [];
  
        const result = testRetroactively(purchaseHistory, mockHistory, retroSettings);
    });
  });
});