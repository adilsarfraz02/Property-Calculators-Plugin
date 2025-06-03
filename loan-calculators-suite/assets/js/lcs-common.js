/**
 * Loan Calculators Suite - Common JavaScript
 * 
 * This file contains common functions and utilities used by all calculators.
 */

// Create LCS namespace
var LCS = LCS || {};

// Frequency factors for different repayment frequencies
LCS.FREQUENCY_FACTORS = {
    weekly: 52,
    fortnightly: 26,
    monthly: 12
};

// Helper functions
LCS.helpers = {
    // Get numeric value from input field
    getNumericValue: function(inputField) {
        const value = inputField.val().replace(/[^0-9.]/g, '');
        return parseFloat(value) || 0;
    },
    
    // Format number as currency
    formatCurrency: function(value) {
        return '$' + value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    }
};

// Format currency
LCS.formatCurrency = function(value) {
    return '$' + value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
};

// Calculate loan repayment
LCS.calculateLoanRepayment = function(loanAmount, interestRate, loanTerm, repaymentFrequency) {
    const periodsPerYear = LCS.FREQUENCY_FACTORS[repaymentFrequency];
    const totalPeriods = loanTerm * periodsPerYear;
    const ratePerPeriod = interestRate / periodsPerYear;
    
    // Use the loan payment formula: P = (r * PV) / (1 - (1 + r)^-n)
    // Where:
    // P = Payment
    // r = Rate per period
    // PV = Present Value (loan amount)
    // n = Number of periods
    
    if (interestRate === 0) {
        return loanAmount / totalPeriods;
    }
    
    const payment = (ratePerPeriod * loanAmount) / (1 - Math.pow(1 + ratePerPeriod, -totalPeriods));
    
    return payment;
};

// Calculate total interest
LCS.calculateTotalInterest = function(loanAmount, repayment, loanTerm, interestRate, repaymentFrequency) {
    const periodsPerYear = LCS.FREQUENCY_FACTORS[repaymentFrequency];
    const totalPeriods = loanTerm * periodsPerYear;
    const ratePerPeriod = interestRate / periodsPerYear;
    
    let balance = loanAmount;
    let totalInterest = 0;
    
    for (let i = 0; i < totalPeriods; i++) {
        const interestPayment = balance * ratePerPeriod;
        const principalPayment = repayment - interestPayment;
        
        balance -= principalPayment;
        totalInterest += interestPayment;
        
        // Adjust for final payment rounding
        if (i === totalPeriods - 1) {
            balance = 0;
        }
    }
    
    return totalInterest;
};

// Calculate loan term in months
LCS.calculateLoanTerm = function(loanAmount, repayment, interestRate, repaymentFrequency) {
    const periodsPerYear = LCS.FREQUENCY_FACTORS[repaymentFrequency];
    const ratePerPeriod = interestRate / periodsPerYear;
    
    // Use the formula: n = -log(1 - (PV * r) / P) / log(1 + r)
    // Where:
    // n = Number of periods
    // PV = Present Value (loan amount)
    // r = Rate per period
    // P = Payment
    
    if (interestRate === 0) {
        return loanAmount / repayment;
    }
    
    if (repayment <= loanAmount * ratePerPeriod) {
        return Infinity; // Repayment is too small to cover interest
    }
    
    const numberOfPeriods = -Math.log(1 - (loanAmount * ratePerPeriod) / repayment) / Math.log(1 + ratePerPeriod);
    
    // Convert periods to months
    return numberOfPeriods * (12 / periodsPerYear);
};

// Format loan term as years and months
LCS.formatLoanTerm = function(totalMonths) {
    const years = Math.floor(totalMonths / 12);
    const months = Math.round(totalMonths % 12);
    
    let result = '';
    
    if (years > 0) {
        result += years + ' year' + (years !== 1 ? 's' : '');
    }
    
    if (months > 0) {
        if (result.length > 0) {
            result += ', ';
        }
        result += months + ' month' + (months !== 1 ? 's' : '');
    }
    
    return result.length > 0 ? result : '0 months';
};

// Generate amortization schedule
LCS.generateAmortizationSchedule = function(loanAmount, interestRate, repayment, repaymentFrequency, maxPeriods) {
    const periodsPerYear = LCS.FREQUENCY_FACTORS[repaymentFrequency];
    const ratePerPeriod = interestRate / periodsPerYear;
    
    let schedule = [];
    let balance = loanAmount;
    let totalInterest = 0;
    let period = 0;
    
    while (balance > 0 && period < maxPeriods) {
        period++;
        
        const interestPayment = balance * ratePerPeriod;
        const principalPayment = Math.min(repayment - interestPayment, balance);
        
        balance -= principalPayment;
        totalInterest += interestPayment;
        
        // Adjust for final payment rounding
        if (balance < 0.01) {
            balance = 0;
        }
        
        schedule.push({
            period: period,
            payment: repayment,
            principalPayment: principalPayment,
            interestPayment: interestPayment,
            totalInterest: totalInterest,
            balance: balance
        });
        
        if (balance === 0) {
            break;
        }
    }
    
    return schedule;
};

// Initialize common functionality
jQuery(document).ready(function($) {
    // Add input validation
    $('.lcs-calculator input[type="text"]').on('input', function() {
        // Allow only numbers and decimal point
        $(this).val($(this).val().replace(/[^0-9.]/g, ''));
        
        // Ensure only one decimal point
        const parts = $(this).val().split('.');
        if (parts.length > 2) {
            $(this).val(parts[0] + '.' + parts.slice(1).join(''));
        }
    });
});