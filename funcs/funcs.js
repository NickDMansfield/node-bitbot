const moment = require('moment');
const _ = require('lodash');
const dict = require('../dict');

module.exports = {
    analyzeOrderHistory (orderHistory){
        if (!orderHistory || !Array.isArray(orderHistory)) {
            throw new Error('No order history array supplied');
        }

        const allBuys = _.filter(orderHistory, oh => oh.orderType === dict.orderTypes.BUY);
        const allSales = _.filter(orderHistory, oh => oh.orderType === dict.orderTypes.SELL);


        const totalSymbolAmount = _.sumBy(allBuys, ph => Number.isNaN(ph.quantity) ? 0 : ph.quantity) - _.sumBy(allSales, ph => Number.isNaN(ph.quantity) ? 0 : ph.quantity);
        const totalSymbolCost = _.sumBy(allBuys, ph => (Number.isNaN(ph.price) || Number.isNaN(ph.quantity)) ? 0 : ph.price * ph.quantity) - _.sumBy(allSales, ph => (Number.isNaN(ph.price) || Number.isNaN(ph.quantity)) ? 0 : ph.price * ph.quantity);
        // If there are no items in the array, it will otherwise divide by 0 and throw an exception
        const averagePrice = totalSymbolAmount ? totalSymbolCost/totalSymbolAmount : 0;
        return {
            totalSymbolAmount,
            totalSymbolCost,
            averagePrice
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
        if (!initialRecord) {
            throw new Error('You must provide an initialRecord arg object');
        }
        if (!initialRecord.price || Number.isNaN(parseFloat(initialRecord.price))) {
            throw new Error('initialRecord must have a numeric price value');
        }
        if (!initialRecord.createdAt || !this.isDate(initialRecord.createdAt)) {
            throw new Error('initialRecord must have a createdAt datetime property');
        }

        if (!recentRecord) {
            throw new Error('You must provide an recentRecord arg object');
        }
        if (!recentRecord.price || Number.isNaN(parseFloat(recentRecord.price))) {
            throw new Error('recentRecord must have a numeric price value');
        }
        if (!recentRecord.createdAt || !this.isDate(recentRecord.createdAt)) {
            throw new Error('recentRecord must have a createdAt datetime property');
        }

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
        // This assumes that the user has already made the decision to short. It is only meant to calculate the short value

        if (!priceHistory) {
            throw new Error('No priceHistory arg provided');
        }
        if (!processSettings) {
            throw new Error('No processSettings arg provided');
        }
        if (!processSettings.timeToEvaluate) {
            throw new Error('No processSettings.timeToEvaluate provided');
        }
        if (!processSettings.averagePrice && processSettings.averagePrice !== 0) {
            throw new Error('No processSettings.averagePrice provided');
        }
        if (!processSettings.currentPrice && processSettings.currentPrice !== 0) {
            throw new Error('No processSettings.currentPrice provided');
        }
        if (Number.isNaN(parseFloat(processSettings.currentPrice))) {
            throw new Error('processSettings.currentPrice must be a number');
        }
        if (Number.isNaN(parseFloat(processSettings.averagePrice))) {
            throw new Error('processSettings.averagePrice must be a number');
        }

        if (processSettings.currentPrice < processSettings.averagePrice && !processSettings.enableSuicideShorts) {
            throw new Error('An attempt to calculate a suicide short was made. Set enableSuicideShorts to true in the processSettings to bypass this');
        }
        
        let weeklyLow = _.filter(priceHistory, obj => moment(obj.createdAt).isAfter(moment(processSettings.timeToEvaluate).subtract(7, 'days')));
        weeklyLow = _.sortBy(weeklyLow, 'price', 'ASC')[0].price;
        
        // _.chain(priceHistory)
        // .filter(obj => moment(obj.createdAt).isAfter(moment().subtract(7, 'days')));
        // .minBy('price')
        // .get('price', null)
        // .value();
        
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
            if (processSettings.overrideWeeklyLow || weeklyLow > shortReductionPercentAdjustedBuyPrice) {
                shortBuyPrice = shortReductionPercentAdjustedBuyPrice;
            }
        } 
        return shortBuyPrice;
    },

    filterRunnableLimitOrders (limitOrders, currentPrice) {
        if (!limitOrders || !Array.isArray(limitOrders)) {
            throw new Error('You must provide a limitOrders array');
        }

        if (!currentPrice && Number.isNaN(currentPrice)) {
            throw new Error('No currentPrice provided');
        }
        return limitOrders.filter(lo => this.isLimitOrderRunnable(lo, currentPrice));
    },
    isLimitOrderRunnable(limitOrder, currentPrice) {
        if (!limitOrder || typeof limitOrder !== 'object') {
            throw new Error('You must provide a limitOrder object');
        }

        if (!limitOrder.amountToBuy && !limitOrder.amountToSell) {
            throw new Error('You must provide either an amountToSell or an amountToBuy');
        }

        if (!limitOrder.price) {
            throw new Error('You must provide a price property on the limitOrder');
        }

        if (Number.isNaN(parseFloat(limitOrder.price))) {
            throw new Error('limitOrder.price must be a number');
        }

        if (!currentPrice || Number.isNaN(parseFloat(currentPrice))) {
            throw new Error('No currentPrice number provided');
        }

        if (limitOrder.completedOn) {
            return false;
        }

            // buy order, so we want a lower price than the listed limit
        return limitOrder.amountToBuy ? currentPrice <= limitOrder.price : 
            // sell, so we will happily take a higher value
            currentPrice >= limitOrder.price;
    },

    isDate(dateStr) {
        // TODO: Add tests
        if (!dateStr) {
            return false;
        }
        var date = new Date(dateStr);
        return date instanceof Date && !isNaN(date.valueOf());
    },

    shouldRunPeriodicTransaction(periodicTransaction, lastPeriodRunTime) {
        if (!periodicTransaction || typeof periodicTransaction !== 'object') {
            throw new Error('You must provide a periodicTransaction object');
        }
        if (typeof periodicTransaction.units !== 'string') {
            throw new Error('the periodicTransaction object must have a string units property');
        }
        if (typeof periodicTransaction.period !== 'string') {
            throw new Error('the periodicTransaction object must have a string period property');
        }
        if (typeof periodicTransaction.orderType !== 'string') {
            throw new Error('the periodicTransaction object must have a string orderType property');
        }
        if (!periodicTransaction.quantity || Number.isNaN(Number.parseFloat(periodicTransaction.quantity))) {
            throw new Error('the periodicTransaction object must have a numeric quantity property');
        }
        if (lastPeriodRunTime && !this.isDate(lastPeriodRunTime)) {
            throw new Error('You must provide a lastPeriodRunTime date');
        }
        if (!lastPeriodRunTime) {
            return true;
        }

        const isWithinLast24Hours = moment().diff(moment(lastPeriodRunTime), 'hours') < 24;
        const isWithinLastWeek = moment().diff(moment(lastPeriodRunTime), 'days') < 7;

        if (periodicTransaction.period === dict.periods.WEEKLY && isWithinLastWeek) {
            return false;
        }
        if (periodicTransaction.period === dict.periods.DAILY && isWithinLast24Hours) {
            return false;
        }

        return true;
    },

}