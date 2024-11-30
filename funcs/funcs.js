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
    }
}