const _ = require('lodash');

module.exports = {
    testRetroactively (purchaseHistoryForSymbol, priceHistoryToAnalyze, retroSettings) {
        
    // Validate
        if (!purchaseHistoryForSymbol) {
            throw new Error('No purchaseHistoryForSymbol supplied');
        }
        if (!priceHistoryToAnalyze) {
            throw new Error('No priceHistoryToAnalyze supplied');
        }
        if (!retroSettings) {
            throw new Error('No retro settings supplied');
        }
        // check types and vals
        if (typeof retroSettings !== 'object' || Array.isArray(retroSettings)) {
            throw new Error('retroSettings must be an object');
        }
        if (!Array.isArray(purchaseHistoryForSymbol)) {
            throw new Error('purchaseHistoryForSymbol must be an array')
        }
        if (!Array.isArray(priceHistoryToAnalyze)) {
            throw new Error('priceHistoryToAnalyze must be an array')
        }
        if (!priceHistoryToAnalyze.length) {
            throw new Error('priceHistoryToAnalyze must be an array with at least one item')
        }
        if (retroSettings.initialLiquid === undefined || retroSettings.initialLiquid === null) {
            throw new Error('No initialLiquid value provided in retroSettings');
        }

        const sortedPriceHistory = _.sortBy(priceHistoryToAnalyze, 'createdAt', 'ASC');
        const firstRecord = sortedPriceHistory[0];
        const lastRecord = sortedPriceHistory[sortedPriceHistory.length-1];
        
        let finalLiquid = 0;
        let finalPositions = [];
        let symbolTotal = 0;
        let totalGrowth = 0;
        let totalGrowthPercent = 0;

        return {
            symbol: retroSettings.symbol,
            initialLiquid: retroSettings.initialLiquid,
            // TODO: figure out if this is actually different conceptually from the purchaseHistory 
            // initialPositions: [],
            initialPrice: firstRecord.price,
            finalLiquid,
            finalPositions,
            finalPrice: lastRecord.price,
            symbolTotal,
            symbolTotalInUSD: symbolTotal * lastRecord.price,
            totalGrowth,
            totalGrowthPercent
        }
    }
}