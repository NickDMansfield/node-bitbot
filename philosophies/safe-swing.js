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
        if (!processSettings) {
            throw new Error('You must provide a processSettings arg object');
        }

        const sortedPriceHistory = _.sortBy(priceHistory, 'createdAt', 'ASC');
        const firstRecord = sortedPriceHistory[0];
        const lastRecord = sortedPriceHistory[sortedPriceHistory.length-1];
        const currentPrice = lastRecord.price;
        const averagePrice = _.sumBy(purchaseHistory, 'price')/purchaseHistory.length;

        let amountToSell = 0;
        let amountToBuy = 0;


        return {
            shouldBuy: false,
            shouldSell: false,
            amountToBuy,
            amountToSell,
            // these should probably be run after the 'manual' transactions
            limitOrdersToSet: [],
            estimatedCost: currentPrice * amountToBuy,
            symbol: processSettings.symbol,
        };
    }
}