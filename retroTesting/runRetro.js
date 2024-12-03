/*
    The purpose of this is to run retro tests against past data to analyze the viability of trading strats.
        This class can be called independently or from the retroTests test. The latter is used to run against 
        a series of datasets to get some testing against multiple patterns and coin types (altcoins, memecoins, stablecoins etc)

    The shorthand purpose is to run the analyzer on each loop as though the loop were a new period, then use the analyzer's 
        data to take appropriate action (buy, sell, limit, etc).  It tracks the running totals as the time goes on and outputs a final report.
        This is not part of the actual purchase process.  The data analytics are handled in the processData functions. 
        This is just a simulator script to manage the retro testing



*/


const _ = require('lodash');
const philosophy = require('../philosophies/index');

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
        if (!retroSettings.philosophy || typeof retroSettings.philosophy !== 'string') {
            throw new Error('retroSettings MUST have a philosophy string property')
        }
        if (!philosophy[retroSettings.philosophy]) {
            throw new Error(`philosophy function ${retroSettings.philosophy} does not exist`)
        }
        if (!philosophy[retroSettings.philosophy].processData || typeof philosophy[retroSettings.philosophy].processData !== 'function') {
            throw new Error(`philosophy function ${retroSettings.philosophy} must have a processData function`)
        }

    // Implement

        const sortedPriceHistory = _.sortBy(priceHistoryToAnalyze, 'createdAt', 'ASC');
        const firstRecord = sortedPriceHistory[0];
        const lastRecord = sortedPriceHistory[sortedPriceHistory.length-1];

        const runningPriceHistory = [];
        const analyzedHistories = [];

        const processSettings = {
            symbol: retroSettings.symbol
        };

        // simulates the stream of data records. 
        //  Thank goodness for sample data
        for (let curPriceRecord of sortedPriceHistory) {
            runningPriceHistory.push(curPriceRecord);
            const analyzedRecord = philosophy[retroSettings.philosophy].processData(processSettings, runningPriceHistory, purchaseHistoryForSymbol);
            analyzedHistories.push(analyzedRecord);

            // Handle the new results
        }
        
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