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
        //  We use a +1 because hourly records aren't truly subtractive. 18:00-22:00 is technically five hours
        //      because it only measures the start of the hour
        const totalTime = moment(recentRecord.createdAt).diff(moment(initialRecord.createdAt), 'hours') + 1;
        // Calculate the totalGrowth
        const totalGrowth = recentRecord.price - initialRecord.price;
        // Calculate the totalGrowthPercent
        const totalGrowthPercent = recentRecord.price > initialRecord.price ?
        // profits
        // 200                  220                     200 => 0.1
        (recentRecord.price - initialRecord.price) / initialRecord.price
        :
        // this handles losses
        // 200                  150                     -200 => -0.75
        (initialRecord.price - recentRecord.price) / -initialRecord.price;

        const growthRate = totalGrowthPercent/totalTime;
        return {
            totalTime,
            totalGrowth,
            totalGrowthPercent,
            growthRate
        }
    }
}