/**
 * Common JavaScript for Loan Calculators Suite
 */

jQuery(document).ready(function($) {
    /**
     * Constants
     */
    const LCS = {
        // Interest rate constants
        BUFFER_RATE: 0.03, // 3% buffer rate
        FLOOR_RATE: 0.0575, // 5.75% floor rate
        
        // Frequency conversion factors
        FREQUENCY_FACTORS: {
            weekly: 52,
            fortnightly: 26,
            monthly: 12,
            annually: 1
        },
        
        // Default values
        DEFAULT_HEM: 2000, // Default monthly Household Expenditure Measure
        
        // Utility functions
        formatCurrency: function(amount) {
            return '$' + amount.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
        },
        
        formatNumber: function(number, decimals = 0) {
            return number.toLocaleString(undefined, {
                minimumFractionDigits: decimals,
                maximumFractionDigits: decimals
            });
        },
        
        formatPercentage: function(rate) {
            return (rate * 100).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }) + '%';
        },
        
        // Convert annual interest rate to monthly
        getMonthlyRate: function(annualRate) {
            return annualRate / 12;
        },
        
        // Convert between different payment frequencies
        convertPaymentFrequency: function(amount, fromFrequency, toFrequency) {
            const annualAmount = amount * this.FREQUENCY_FACTORS[fromFrequency];
            return annualAmount / this.FREQUENCY_FACTORS[toFrequency];
        },
        
        // Calculate loan repayment amount
        calculateLoanRepayment: function(principal, annualRate, termYears, frequency = 'monthly') {
            // Convert annual interest rate to rate per period
            const periodsPerYear = this.FREQUENCY_FACTORS[frequency];
            const ratePerPeriod = annualRate / periodsPerYear;
            
            // Calculate total number of payments
            const totalPeriods = termYears * periodsPerYear;
            
            // Calculate payment using formula: P = (r * PV) / (1 - (1 + r)^-n)
            if (ratePerPeriod === 0) {
                return principal / totalPeriods;
            } else {
                const x = Math.pow(1 + ratePerPeriod, totalPeriods);
                return (ratePerPeriod * principal * x) / (x - 1);
            }
        },
        
        // Calculate total interest paid over loan term
        calculateTotalInterest: function(principal, payment, termYears, annualRate, frequency = 'monthly') {
            const periodsPerYear = this.FREQUENCY_FACTORS[frequency];
            const totalPeriods = termYears * periodsPerYear;
            const totalPayments = payment * totalPeriods;
            
            return totalPayments - principal;
        },
        
        // Calculate loan term in years given payment amount
        calculateLoanTerm: function(principal, payment, annualRate, frequency = 'monthly') {
            // Convert annual interest rate to rate per period
            const periodsPerYear = this.FREQUENCY_FACTORS[frequency];
            const ratePerPeriod = annualRate / periodsPerYear;
            
            // If rate is 0 or payment is 0, handle special cases
            if (ratePerPeriod === 0 || payment === 0) {
                return principal / payment / periodsPerYear;
            }
            
            // Calculate term using formula: n = -log(1 - (P * r) / PMT) / log(1 + r)
            const n = -Math.log(1 - (principal * ratePerPeriod / payment)) / Math.log(1 + ratePerPeriod);
            
            return n / periodsPerYear;
        },
        
        // Generate amortization schedule
        generateAmortizationSchedule: function(principal, annualRate, termYears, frequency = 'monthly') {
            const periodsPerYear = this.FREQUENCY_FACTORS[frequency];
            const ratePerPeriod = annualRate / periodsPerYear;
            const totalPeriods = termYears * periodsPerYear;
            const payment = this.calculateLoanRepayment(principal, annualRate, termYears, frequency);
            
            let schedule = [];
            let balance = principal;
            let totalInterest = 0;
            
            for (let period = 1; period <= totalPeriods; period++) {
                const interestPayment = balance * ratePerPeriod;
                const principalPayment = payment - interestPayment;
                
                balance -= principalPayment;
                totalInterest += interestPayment;
                
                // Adjust for final payment rounding
                if (period === totalPeriods) {
                    balance = 0;
                }
                
                schedule.push({
                    period: period,
                    payment: payment,
                    principalPayment: principalPayment,
                    interestPayment: interestPayment,
                    totalInterest: totalInterest,
                    balance: balance
                });
            }
            
            return schedule;
        }
    };
    
    // Make LCS available globally
    window.LCS = LCS;
    
    /**
     * Input Formatting Functions
     */
    
    // Format currency inputs
    function setupCurrencyInputs() {
        $('.lcs-currency-input').each(function() {
            $(this).on('input', function() {
                let value = $(this).val().replace(/[^\d]/g, '');
                if (value) {
                    let numValue = parseInt(value);
                    $(this).val(numValue.toLocaleString());
                }
            });

            $(this).on('focus', function() {
                let value = $(this).val().replace(/[^\d]/g, '');
                $(this).val(value);
            });

            $(this).on('blur', function() {
                let value = $(this).val().replace(/[^\d]/g, '');
                if (value) {
                    let numValue = parseInt(value);
                    $(this).val(numValue.toLocaleString());
                }
            });
        });
    }
    
    // Format rate inputs
    function setupRateInputs() {
        $('.lcs-rate-input').each(function() {
            $(this).on('input', function() {
                let value = $(this).val().replace(/[^\d.]/g, '');
                // Allow only one decimal point
                let parts = value.split('.');
                if (parts.length > 2) {
                    value = parts[0] + '.' + parts.slice(1).join('');
                }
                // Limit to 2 decimal places
                if (parts[1] && parts[1].length > 2) {
                    value = parts[0] + '.' + parts[1].substring(0, 2);
                }
                $(this).val(value);
            });
        });
    }
    
    // Format number inputs
    function setupNumberInputs() {
        $('.lcs-number-input').each(function() {
            $(this).on('input', function() {
                let value = $(this).val().replace(/[^\d]/g, '');
                $(this).val(value);
            });
        });
    }
    
    // Get numeric value from formatted input
    function getNumericValue($input) {
        let value = $input.val().replace(/[^\d.]/g, '');
        return parseFloat(value) || 0;
    }
    
    // Setup toggle buttons
    function setupToggleButtons() {
        $('.lcs-toggle-btn').click(function(e) {
            e.preventDefault();
            
            const $this = $(this);
            const $group = $this.closest('.lcs-toggle-group');
            const $hiddenInput = $group.siblings('input[type="hidden"]');
            
            // Remove active class from all buttons in group
            $group.find('.lcs-toggle-btn').removeClass('active');
            
            // Add active class to clicked button
            $this.addClass('active');
            
            // Update hidden input value
            if ($hiddenInput.length) {
                $hiddenInput.val($this.data('value'));
                $hiddenInput.trigger('change');
            }
        });
    }
    
    // Setup number buttons
    function setupNumberButtons() {
        $('.lcs-number-btn').click(function(e) {
            e.preventDefault();
            
            const $this = $(this);
            const $group = $this.closest('.lcs-number-group');
            const $hiddenInput = $group.siblings('input[type="hidden"]');
            
            // Remove active class from all buttons in group
            $group.find('.lcs-number-btn').removeClass('active');
            
            // Add active class to clicked button
            $this.addClass('active');
            
            // Update hidden input value
            if ($hiddenInput.length) {
                $hiddenInput.val($this.data('value'));
                $hiddenInput.trigger('change');
            }
        });
    }
    
    // Setup modal functionality
    function setupModals() {
        // Open modal
        $('.lcs-modal-open').click(function(e) {
            e.preventDefault();
            const modalId = $(this).data('modal');
            $('#' + modalId).fadeIn();
        });
        
        // Close modal
        $('.lcs-modal-close, .lcs-modal-cancel').click(function() {
            $(this).closest('.lcs-modal').fadeOut();
        });
        
        // Close modal when clicking outside content
        $('.lcs-modal').click(function(e) {
            if ($(e.target).hasClass('lcs-modal')) {
                $(this).fadeOut();
            }
        });
    }
    
    // Initialize common functionality
    function initCommonFunctionality() {
        setupCurrencyInputs();
        setupRateInputs();
        setupNumberInputs();
        setupToggleButtons();
        setupNumberButtons();
        setupModals();
    }
    
    // Initialize on document ready
    initCommonFunctionality();
    
    // Make helper functions available globally
    window.LCS.helpers = {
        getNumericValue: getNumericValue,
        setupCurrencyInputs: setupCurrencyInputs,
        setupRateInputs: setupRateInputs,
        setupNumberInputs: setupNumberInputs,
        setupToggleButtons: setupToggleButtons,
        setupNumberButtons: setupNumberButtons,
        setupModals: setupModals
    };
});