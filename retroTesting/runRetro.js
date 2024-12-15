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
const dict = require('../dict');
const funcs = require('../funcs/funcs');
const { isLimitOrderRunnable } = require('../funcs/funcs');

module.exports = {
    testRetroactively (orderHistoryForSymbol, priceHistoryToAnalyze, retroSettings) {
        
    // Validate
        if (!orderHistoryForSymbol) {
            throw new Error('No orderHistoryForSymbol supplied');
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
        if (!Array.isArray(orderHistoryForSymbol)) {
            throw new Error('orderHistoryForSymbol must be an array')
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
        if (retroSettings.initialSymbolAmount === undefined || retroSettings.initialSymbolAmount === null) {
            throw new Error('No initialSymbolAmount value provided in retroSettings');
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
        const initialPrice = firstRecord.price;
        const lastRecord = sortedPriceHistory[sortedPriceHistory.length-1];

        const runningPriceHistory = [];
        const analyzedHistories = [];
        let limitOrders = [];

        const processSettings = {
            symbol: retroSettings.symbol,
            minimumProfitPercentToSell: retroSettings.minimumProfitPercentToSell,
            useCurrentPriceForAdjustment: retroSettings.useCurrentPriceForAdjustment,
            overrideWeeklyLow: retroSettings.overrideWeeklyLow,
            shortAdjustmentModifier: retroSettings.shortAdjustmentModifier
        };
        
        let finalLiquid = retroSettings.initialLiquid;
        let finalPositions = [];
        let symbolTotal = retroSettings.initialSymbolAmount;
        let totalGrowth = 0;
        let totalGrowthPercent = 0;

        let lastPeriodicTransactionRunTime = null;

        // simulates the stream of data records. 
        //  Thank goodness for sample data
        for (let curPriceRecord of sortedPriceHistory) {
            // Think of each iteration as a new hour or day
            runningPriceHistory.push(curPriceRecord);
            if (!curPriceRecord) {
                continue;
            }
        //   console.log(`Running ${curPriceRecord.createdAt}`);

            // Periodic buys
            if (retroSettings.periodicTransactions && Array.isArray(retroSettings.periodicTransactions)) {
                //  Determine if a periodic buy should occur here
                for (let periodicTransaction of retroSettings.periodicTransactions) {
                    if (funcs.shouldRunPeriodicTransaction(periodicTransaction, lastPeriodicTransactionRunTime)) {

                        // Update the last run time on a per-period basis
                        lastPeriodicTransactionRunTime = curPriceRecord.createdAt;

                        let symbolQuantityModification = 0;
                        let liquidModification = 0;
                        if (periodicTransaction.orderType === dict.orderTypes.BUY) {
                            if (periodicTransaction.units === dict.units.SYMBOL && finalLiquid >= (periodicTransaction.quantity * curPriceRecord.price)) {
                                symbolQuantityModification = periodicTransaction.quantity;
                                liquidModification = -(periodicTransaction.quantity * curPriceRecord.price);
                            }

                            // Make sure it won't purchase if there isn't enough money
                            if (periodicTransaction.units === dict.units.USD && finalLiquid >= periodicTransaction.quantity) {
                                symbolQuantityModification = (periodicTransaction.quantity / curPriceRecord.price);
                                liquidModification = -periodicTransaction.quantity;
                            }

                            orderHistoryForSymbol.push({ symbol: retroSettings.symbol, quantity: symbolQuantityModification, price: curPriceRecord.price, orderType: dict.orderTypes.BUY });

                        } else if (periodicTransaction.orderType === dict.orderTypes.SELL) {
                            if (periodicTransaction.units === dict.units.SYMBOL) {
                                symbolQuantityModification = -periodicTransaction.quantity;
                                liquidModification = periodicTransaction.quantity * curPriceRecord.price;
                            }

                            if (periodicTransaction.units === dict.units.USD) {
                                symbolQuantityModification = -(periodicTransaction.quantity / curPriceRecord.price);
                                liquidModification = periodicTransaction.quantity;
                            }
                            orderHistoryForSymbol.push({ symbol: retroSettings.symbol, quantity: symbolQuantityModification, price: curPriceRecord.price, orderType: dict.orderTypes.SELL });
                        }
                        // We always use += since the negative is baked in above
                        finalLiquid += liquidModification;
                        symbolTotal += symbolQuantityModification;
                    }            
                }
            }

            // Limit Orders
            if (limitOrders && Array.isArray(limitOrders)) {
                for (let limitOrder of limitOrders) {
                    if (isLimitOrderRunnable(limitOrder, curPriceRecord.price)) {

                        let symbolQuantityModification = 0;
                        let liquidModification = 0;
                        if (limitOrder.amountToBuy) {
                            if (finalLiquid >= (limitOrder.amountToBuy * curPriceRecord.price)) {
                                symbolQuantityModification = limitOrder.amountToBuy;
                                liquidModification = -(limitOrder.amountToBuy * curPriceRecord.price);

                                limitOrder.completedOn = (new Date()).toDateString();

                                // We only need to append the orderHistory if it is a purchase
                                orderHistoryForSymbol.push({ symbol: retroSettings.symbol, quantity: symbolQuantityModification, price: curPriceRecord.price, limitOrder, orderType: dict.orderTypes.BUY });
                            }
                        } else if (limitOrder.amountToSell) {
                                // TODO: Check that the quantity is available, and clear it if not
                                //     Or possibly account for the limits when setting sales
                            if (symbolTotal >= (limitOrder.amountToSell)) {
                                symbolQuantityModification = -periodicTransaction.quantity;
                                liquidModification = periodicTransaction.quantity * curPriceRecord.price;


                                limitOrder.completedOn = (new Date()).toDateString();
                                orderHistoryForSymbol.push({ symbol: retroSettings.symbol, quantity: symbolQuantityModification, price: curPriceRecord.price, limitOrder, orderType: dict.orderTypes.SELL });
                            }
                        }
                    }
                }
            }
            


            const analyzedRecord = philosophy[retroSettings.philosophy].processData(processSettings, runningPriceHistory, orderHistoryForSymbol);
          //  analyzedHistories.push(analyzedRecord);

            // Set the new limit orders
            // TODO: Verify if we should perhaps instead use the one analyzedRecord. Might improve performance
            limitOrders = [...limitOrders, ...analyzedRecord.limitOrdersToSet];

            // Handle the new results
            if (analyzedRecord.shouldSell && symbolTotal >= analyzedRecord.amountToSell) {
                // This is where we would make an API call if it were a real system
                finalLiquid += analyzedRecord.estimatedRevenue;
                symbolTotal -= analyzedRecord.amountToSell;
            } 
            else // teehee this formatting is whimsically kitschy
            // TODO: Write tests for buying situations
            if (analyzedRecord.shouldBuy && finalLiquid >= analyzedRecord.estimatedCost) {
                // This is where we would make an API call if it were a real system
                finalLiquid -= analyzedRecord.estimatedCost;
                symbolTotal += analyzedRecord.amountToBuy;
               // orderHistoryForSymbol.push({ symbol: retroSettings.symbol, quantity: analyzedRecord.amountToSell, price: curPriceRecord.price });
            }

        }

        // package up and present the data
        const totalLiquidGrowth = finalLiquid - retroSettings.initialLiquid;
        const totalSymbolGrowth = symbolTotal - retroSettings.initialSymbolAmount;
        const finalSymbolEquity = symbolTotal * lastRecord.price;
        const initialSymbolEquity = retroSettings.initialSymbolAmount * initialPrice;
        const finalTotalEquity = finalSymbolEquity + finalLiquid;
        const initialTotalEquity = initialSymbolEquity + retroSettings.initialLiquid;

        totalGrowth = finalTotalEquity - initialTotalEquity;
        totalGrowthPercent = finalTotalEquity / initialTotalEquity // This is a multiple, (ie 1.05 for 5%)

        return {
            symbol: retroSettings.symbol,
            initialLiquid: retroSettings.initialLiquid,
            // TODO: figure out if this is actually different conceptually from the orderHistory 
            // initialPositions: [],
            initialPrice,
            finalLiquid,
            // finalPositions,
            finalPrice: lastRecord.price,
            symbolTotal,
            symbolTotalInUSD: finalSymbolEquity,
            totalGrowth,
            totalGrowthPercent,
            analyzedHistories
        }
    }
}