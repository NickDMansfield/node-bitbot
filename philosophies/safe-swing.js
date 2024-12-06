// DESCRIPTION
/*
    This philosophy's approach is to keep track of a profit-adjusted moving average and to
     sell and short the entire position when it crosses a certain profit threshold.  This does NOT 
     track acceleration. It simply compares the average price of all purchases.  It's 
     fundamentally the exact same as the lazy Robinhood method.  
     
     -This method will never make a non-shorted purchase

     PS: A more advanced version of this would use acceleration to determine more flexible shorts and buys

*/

const _ = require('lodash');
const funcs = require('../funcs/funcs');

module.exports = {
        processData (processSettings, priceHistory, purchaseHistory) {
    //  This is meant to be called against one record (which is the last in the index), and should be run on every single period
    //      Sort of a minute-by-minute process which handles streaming periods of data
        // priceHistory should be inclusive of the current price being tested

        if (!purchaseHistory || !Array.isArray(purchaseHistory)) {
            throw new Error('You must provide a purchaseHistory array arg');
        }
        if (!priceHistory || !Array.isArray(priceHistory)) {
            throw new Error('You must provide a priceHistory array arg');
        }
        // processSettings tests
        if (!processSettings) {
            throw new Error('You must provide a processSettings arg object');
        }

        const sortedPriceHistory = _.sortBy(priceHistory, 'createdAt', 'ASC');
        const lastRecord = sortedPriceHistory[sortedPriceHistory.length-1];
        const currentPrice = lastRecord.price;
        const totalSymbolAmount = _.sumBy(purchaseHistory, ph => Number.isNaN(ph.quantity) ? 0 : ph.quantity);
        const totalSymbolCost = _.sumBy(purchaseHistory, ph => (Number.isNaN(ph.price) || Number.isNaN(ph.quantity)) ? 0 : ph.price * ph.quantity);
        const currentTotalEquity = totalSymbolAmount * currentPrice;
        // If there are no items in the array, it will otherwise divide by 0 and throw an exception
        const averagePrice = totalSymbolAmount ? totalSymbolCost/totalSymbolAmount : 0;

        let amountToSell = 0;
        let amountToBuy = 0;
        let shouldBuy = false;
        let shouldSell = false;
        let limitOrdersToSet = []

        if (currentPrice > averagePrice) {
            if (processSettings.minimumProfitPercentToSell) {
                const currentProfitPercent = (currentPrice / averagePrice) - 1; // 0.1 = 10%
                if (currentProfitPercent >= processSettings.minimumProfitPercentToSell) {
                    amountToSell = totalSymbolAmount;
                    shouldSell = true;
                    
                    //  Determine if a short is necessary
                    //      In this case we always short
                    const shortBuyPrice = funcs.calculateShortValue(priceHistory, { ...processSettings, currentPrice, averagePrice });
                    limitOrdersToSet.push({
                        symbol: processSettings.symbol,
                        // This is not a typo. We are moving the entire position
                        amountToBuy: amountToSell,
                        price: shortBuyPrice,
                    });
                }
            }
        }

        return {
            shouldBuy,
            shouldSell,
            amountToBuy,
            amountToSell,
            // these should probably be run after the 'manual' transactions
            limitOrdersToSet,
            estimatedCost: currentPrice * amountToBuy,
            estimatedRevenue: currentPrice * amountToSell,
            symbol: processSettings.symbol,
        };
    }
}