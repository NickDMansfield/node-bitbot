const moment = require('moment');
const _ = require('lodash');

module.exports = {
    analyzePurchaseLogs (){
        return {
            
        }
    },
    calculateAccelerationForRange (historyRecords) {
        if (!historyRecords || !historyRecords.length || historyRecords.length < 2) {
            throw new Error('You must submit an array with at least two historical price records');
        }
        // Sort the records by date
        const sortedRecords = _.sortBy(historyRecords, 'createdAt', 'ASC');

        // Store the first and last record
        const lastRecord = sortedRecords[sortedRecords.length - 1];

        // Begin the step-by-step iterations
        //  We skip the last one because we need at least two records to compar
        return historyRecords.slice(0,historyRecords.length-1).map(rec => this.calculateAcceleration(rec, lastRecord));
    },

    calculateAcceleration (initialRecord, recentRecord) {

        // Calculate the totalTime
        const totalTime = moment(recentRecord.createdAt).diff(moment(initialRecord.createdAt), 'hours');
        // Calculate the totalGrowth
        const totalGrowth = recentRecord.price - initialRecord.price;
        // Calculate the totalGrowthPercent
        const totalGrowthPercent = (recentRecord.price - initialRecord.price) / initialRecord.price

        const growthRate = totalGrowthPercent/totalTime;
        return {
            totalTime,
            totalGrowth,
            totalGrowthPercent,
            growthRate
        }
    },

    calculateShortValue (priceHistory, processSettings) {

        
        const weeklyLow = _.chain(priceHistory)
        .filter(obj => moment(obj.createdAt).isAfter(moment().subtract(7, 'days')))
        .minBy('price')
        .get('price', null)
        .value();
        
        // Determine short price

        let shortBuyPrice = weeklyLow;
        // Sometimes we may want to use the current price instead of the average for adjustments.
        //  This allows for a more swing-heavy micro-ier strategy
        let shortBaseValue = processSettings.useCurrentPriceForAdjustment ? processSettings.currentPrice : processSettings.averagePrice;

        // lmao this is one mfin long variable name
        let shortReductionPercentAdjustedBuyPrice = null;
        if (processSettings.shortAdjustmentModifier) {
            // This is a multiplier, so a 5% ease up on the short would be 1.05 and a 3% reduction would be 0.97
            shortReductionPercentAdjustedBuyPrice = shortBaseValue * processSettings.shortAdjustmentModifier;
            //  We allow an override in case you want to use a more aggressive upswing on crabbing
            if (processSettings.overrideWeeklyLow || weeklyLow < shortReductionPercentAdjustedBuyPrice) {
                shortBuyPrice = shortReductionPercentAdjustedBuyPrice;
            }
        } 
        return shortBuyPrice;
    }
}