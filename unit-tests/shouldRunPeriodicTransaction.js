 var assert = require('assert');
 const funcs = require('../funcs/funcs');
 const dict = require('../dict');

 describe('shouldRunPeriodicTransaction', function () {
   describe('Success states', function () {
     it('should return true when no prior period is dropped in', function () {
       assert.equal([1, 2, 3].indexOf(4), 99);
     });

     it('should return true on a valid daily with prior records', function () {
       assert.equal([1, 2, 3].indexOf(4), 99);
     });

     it('should return true on a valid daily with prior records within a week', function () {
       assert.equal([1, 2, 3].indexOf(4), 99);
     });

     it('should return false on a daily with a prior transaction that day', function () {
       assert.equal([1, 2, 3].indexOf(4), 99);
     });

     it('should return true on a valid weekly with prior records', function () {
       assert.equal([1, 2, 3].indexOf(4), 99);
     });

     it('should return false on a weekly with a prior transaction that week', function () {
       assert.equal([1, 2, 3].indexOf(4), 99);
     });
   });

   describe('Failure states', function () {
    
    it('should throw an error when no args are provided', function () {
        assert.throws(() => {
         funcs.shouldRunPeriodicTransaction(); 
        }, Error('You must provide a periodicTransaction object'));
    });
    
    it('should throw an error when no periodic transaction is provided', function () {
        assert.throws(() => {
         funcs.shouldRunPeriodicTransaction(null, '7/7/2024');
        }, Error('You must provide a periodicTransaction object'));
    });
    
    it('should throw an error when a non-object periodic transaction is provided', function () {
        assert.throws(() => {
            funcs.shouldRunPeriodicTransaction(7, '7/7/2024');
        }, Error('You must provide a periodicTransaction object'));
    });
    
    it('should throw an error when periodic transaction is missing the orderType property', function () {
        assert.throws(() => {
            funcs.shouldRunPeriodicTransaction({ units: dict.units.USD, quantity: 10, period: dict.periods.DAILY }, '7/7/2024');
        }, Error('the periodicTransaction object must have a string orderType property'));
    });
    it('should throw an error when periodic transaction has a non-string orderType property', function () {
        assert.throws(() => {
            funcs.shouldRunPeriodicTransaction({ orderType: 78, units: dict.units.USD, quantity: 10, period: dict.periods.DAILY }, '7/7/2024');
        }, Error('the periodicTransaction object must have a string orderType property'));
    });
    

    it('should throw an error when periodic transaction is missing the units property', function () {
        assert.throws(() => {
            funcs.shouldRunPeriodicTransaction({ orderType: dict.orderTypes.BUY, quantity: 10, period: dict.periods.DAILY }, '7/7/2024');
        }, Error('the periodicTransaction object must have a string units property'));
    });
    it('should throw an error when periodic transaction has a non-string units property', function () {
        assert.throws(() => {
            funcs.shouldRunPeriodicTransaction({ orderType: dict.orderTypes.BUY, units: 78, quantity: 10, period: dict.periods.DAILY }, '7/7/2024');
        }, Error('the periodicTransaction object must have a string units property'));
    });
    
    
    it('should throw an error when periodic transaction is missing the quantity property', function () {
        assert.throws(() => {
            funcs.shouldRunPeriodicTransaction({ orderType: dict.orderTypes.BUY, units: dict.units.USD, period: dict.periods.DAILY }, '7/7/2024');
        }, Error('the periodicTransaction object must have a numeric quantity property'));
    });
    it('should throw an error when periodic transaction has a non-numeric quantity property', function () {
        assert.throws(() => {
            funcs.shouldRunPeriodicTransaction({ orderType: dict.orderTypes.BUY, units: dict.units.USD, quantity: 'hello', period: dict.periods.DAILY }, '7/7/2024');
        }, Error('the periodicTransaction object must have a numeric quantity property'));
    });
    
    it('should throw an error when periodic transaction is missing the period property', function () {
        assert.throws(() => {
            funcs.shouldRunPeriodicTransaction({ orderType: dict.orderTypes.BUY, units: dict.units.USD, quantity: 10 }, '7/7/2024');
        }, Error('the periodicTransaction object must have a string period property'));
    });
    it('should throw an error when periodic transaction has a non-string period property', function () {
        assert.throws(() => {
            funcs.shouldRunPeriodicTransaction({ orderType: dict.orderTypes.BUY, units: dict.units.USD, quantity: 10, period: 35 }, '7/7/2024');
        }, Error('the periodicTransaction object must have a string period property'));
    });
    
    it('should throw an error when a non-datetime lastPeriodRunTime is provided', function () {
        assert.throws(() => {
            funcs.shouldRunPeriodicTransaction({ orderType: dict.orderTypes.BUY, units: dict.units.USD, quantity: 10, period: dict.periods.DAILY }, 'dsads');
        }, Error('You must provide a lastPeriodRunTime date'));
    });

   });
 });