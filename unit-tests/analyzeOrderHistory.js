
var assert = require('assert');
const func = require('../funcs/funcs');
const dict = require('../dict');

describe('analyzeOrderHistory', function () {
  describe('Success states', function () {
    it('should return appropriate values on a very simple history with no sell orders', function () {
        const orderhistory = [
            { 
                symbol: 'LTC',
                quantity: 0.05, 
                price: 200,
                orderType: dict.orderTypes.BUY 
            },
            { 
                symbol: 'LTC',
                quantity: 0.051282051282051, 
                price: 195,
                orderType: dict.orderTypes.BUY 
            },
            { 
                symbol: 'LTC',
                quantity: 0.052631578947368, 
                price: 190,
                orderType: dict.orderTypes.BUY 
            }
        ];

        const expectedResults = {
            totalSymbolAmount: 0.153913630229419,
            totalSymbolCost: 29.999999999999865, // floating point math is dumb
            averagePrice: 194.9145111793073
        };

        const { totalSymbolAmount, totalSymbolCost, averagePrice } = func.analyzeOrderHistory(orderhistory);
        
        assert.equal(totalSymbolAmount, expectedResults.totalSymbolAmount);
        assert.equal(totalSymbolCost, expectedResults.totalSymbolCost);
        assert.equal(averagePrice, expectedResults.averagePrice);
    });

    it('should return appropriate values on a very simple history with a sell order', function () {
        const orderhistory = [
            { 
                symbol: 'LTC',
                quantity: 0.05, 
                price: 200,
                orderType: dict.orderTypes.BUY 
            },
            { 
                symbol: 'LTC',
                quantity: 0.051282051282051, 
                price: 195,
                orderType: dict.orderTypes.BUY 
            },
            { 
                symbol: 'LTC',
                quantity: 0.052631578947368, 
                price: 190,
                orderType: dict.orderTypes.BUY 
            },
            { 
                symbol: 'LTC',
                quantity: 0.053913630229419, 
                price: 200,
                orderType: dict.orderTypes.SELL 
            }
        ];

        const expectedResults = {
            totalSymbolAmount: 0.1,
            totalSymbolCost: 19.217273954116067, // floating point math is dumb
            averagePrice: 192.17273954116067
        };

        const { totalSymbolAmount, totalSymbolCost, averagePrice } = func.analyzeOrderHistory(orderhistory);
        
        assert.equal(totalSymbolAmount, expectedResults.totalSymbolAmount);
        assert.equal(totalSymbolCost, expectedResults.totalSymbolCost);
        assert.equal(averagePrice, expectedResults.averagePrice);
    });
  });
  
  describe('Failure states', function () {
    it('should return an error when no order history is provided', function () {
        assert.throws(() => {
            func.analyzeOrderHistory();
        }, Error('No order history array supplied'));
    });
    it('should return an error when a string order history is provided', function () {
        assert.throws(() => {
            func.analyzeOrderHistory('lddlldl');
        }, Error('No order history array supplied'));
    });
    it('should return an error when an obj order history is provided', function () {
        assert.throws(() => {
            func.analyzeOrderHistory({ property1: 'hello' });
        }, Error('No order history array supplied'));
    });
  });
});