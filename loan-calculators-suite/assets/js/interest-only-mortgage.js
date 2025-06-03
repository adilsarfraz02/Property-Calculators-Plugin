/**
 * Interest Only Mortgage Calculator JavaScript
 */

jQuery(document).ready(function($) {
    // Chart instance
    let loanChart = null;

    // Initialize the calculator
    function initializeCalculator() {
        // Setup event listeners
        setupEventListeners();
        
        // Initialize chart
        initializeChart();
        
        // Calculate mortgage payments on load
        calculateMortgagePayments();
    }

    // Set up event listeners
    function setupEventListeners() {
        // Input changes
        $('#loan-amount, #interest-rate, #loan-term, #interest-only-period').on('change', function() {
            calculateMortgagePayments();
        });
        
        // Frequency changes
        $('#repayment-frequency').on('change', function() {
            calculateMortgagePayments();
        });
        
        // Reset button
        $('#reset-calculator').click(function() {
            resetCalculator();
        });
        
        // Print button
        $('#print-results').click(function() {
            printResults();
        });
    }

    // Initialize chart
    function initializeChart() {
        const ctx = document.getElementById('loan-balance-chart').getContext('2d');
        
        loanChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    {
                        label: 'Interest Only',
                        data: [],
                        backgroundColor: 'rgba(0, 115, 170, 0.1)',
                        borderColor: 'rgba(0, 115, 170, 1)',
                        borderWidth: 2,
                        pointRadius: 0,
                        pointHitRadius: 10,
                        fill: true
                    },
                    {
                        label: 'Principal & Interest',
                        data: [],
                        backgroundColor: 'rgba(51, 51, 51, 0.05)',
                        borderColor: 'rgba(51, 51, 51, 0.8)',
                        borderWidth: 2,
                        pointRadius: 0,
                        pointHitRadius: 10,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false, // We're using custom legend
                        position: 'top'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ' + LCS.formatCurrency(context.parsed.y);
                            },
                            title: function(context) {
                                return 'Year ' + context[0].label;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Years'
                        },
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Amount'
                        },
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
    }

    // Calculate mortgage payments
    function calculateMortgagePayments() {
        // Get input values
        const loanAmount = LCS.helpers.getNumericValue($('#loan-amount'));
        const interestRate = LCS.helpers.getNumericValue($('#interest-rate')) / 100;
        const loanTerm = parseInt($('#loan-term').val());
        const interestOnlyPeriod = parseInt($('#interest-only-period').val());
        const repaymentFrequency = $('#repayment-frequency').val();
        
        // Validate interest-only period
        const validInterestOnlyPeriod = Math.min(interestOnlyPeriod, loanTerm);
        
        // Calculate interest-only payment
        const interestOnlyPayment = calculateInterestOnlyPayment(loanAmount, interestRate, repaymentFrequency);
        
        // Calculate principal and interest payment (for the remaining term)
        const remainingTerm = loanTerm - validInterestOnlyPeriod;
        const principalInterestPayment = LCS.calculateLoanRepayment(loanAmount, interestRate, remainingTerm, repaymentFrequency);
        
        // Calculate loan details with interest-only period
        const loanDetails = calculateLoanDetailsWithInterestOnly(loanAmount, interestRate, loanTerm, validInterestOnlyPeriod, interestOnlyPayment, principalInterestPayment, repaymentFrequency);
        
        // Calculate loan details with principal and interest from the start
        const standardPIPayment = LCS.calculateLoanRepayment(loanAmount, interestRate, loanTerm, repaymentFrequency);
        const standardLoanDetails = calculateLoanDetails(loanAmount, interestRate, loanTerm, standardPIPayment, repaymentFrequency);
        
        // Update results
        $('#interest-only-payment-result').text(LCS.formatCurrency(interestOnlyPayment));
        $('#principal-interest-payment-result').text(LCS.formatCurrency(principalInterestPayment));
        $('#total-interest-result').text(LCS.formatCurrency(loanDetails.totalInterest));
        $('#total-payments-result').text(LCS.formatCurrency(loanAmount + loanDetails.totalInterest));
        
        // Update chart
        updateChart(loanDetails.balanceOverTime, standardLoanDetails.balanceOverTime, loanTerm);
        
        // Trigger custom event
        $(document).trigger('calculatorUpdated', {
            calculator: 'interest-only-mortgage',
            loanAmount: loanAmount,
            interestRate: interestRate,
            loanTerm: loanTerm,
            interestOnlyPeriod: validInterestOnlyPeriod,
            interestOnlyPayment: interestOnlyPayment,
            principalInterestPayment: principalInterestPayment,
            totalInterest: loanDetails.totalInterest
        });
    }

    // Calculate interest-only payment
    function calculateInterestOnlyPayment(loanAmount, interestRate, repaymentFrequency) {
        const periodsPerYear = LCS.FREQUENCY_FACTORS[repaymentFrequency];
        const ratePerPeriod = interestRate / periodsPerYear;
        
        return loanAmount * ratePerPeriod;
    }

    // Calculate loan details with interest-only period
    function calculateLoanDetailsWithInterestOnly(loanAmount, interestRate, loanTerm, interestOnlyPeriod, interestOnlyPayment, principalInterestPayment, repaymentFrequency) {
        const periodsPerYear = LCS.FREQUENCY_FACTORS[repaymentFrequency];
        const ratePerPeriod = interestRate / periodsPerYear;
        const totalPeriods = loanTerm * periodsPerYear;
        const interestOnlyPeriods = interestOnlyPeriod * periodsPerYear;
        
        let balance = loanAmount;
        let totalInterest = 0;
        let balanceOverTime = [];
        
        // Add initial balance
        balanceOverTime.push({
            year: 0,
            balance: balance
        });
        
        // Interest-only period
        for (let period = 1; period <= interestOnlyPeriods; period++) {
            const interestPayment = balance * ratePerPeriod;
            totalInterest += interestPayment;
            
            // Store balance at each year mark
            if (period % periodsPerYear === 0) {
                const year = period / periodsPerYear;
                balanceOverTime.push({
                    year: year,
                    balance: balance
                });
            }
        }
        
        // Principal and interest period
        for (let period = interestOnlyPeriods + 1; period <= totalPeriods; period++) {
            const interestPayment = balance * ratePerPeriod;
            const principalPayment = principalInterestPayment - interestPayment;
            
            balance -= principalPayment;
            totalInterest += interestPayment;
            
            // Adjust for final payment rounding
            if (period === totalPeriods) {
                balance = 0;
            }
            
            // Store balance at each year mark
            if (period % periodsPerYear === 0) {
                const year = period / periodsPerYear;
                balanceOverTime.push({
                    year: year,
                    balance: balance
                });
            }
        }
        
        return {
            totalInterest: totalInterest,
            balanceOverTime: balanceOverTime
        };
    }

    // Calculate standard loan details (principal and interest from start)
    function calculateLoanDetails(loanAmount, interestRate, loanTerm, payment, repaymentFrequency) {
        const periodsPerYear = LCS.FREQUENCY_FACTORS[repaymentFrequency];
        const ratePerPeriod = interestRate / periodsPerYear;
        const totalPeriods = loanTerm * periodsPerYear;
        
        let balance = loanAmount;
        let totalInterest = 0;
        let balanceOverTime = [];
        
        // Add initial balance
        balanceOverTime.push({
            year: 0,
            balance: balance
        });
        
        // Calculate amortization
        for (let period = 1; period <= totalPeriods; period++) {
            const interestPayment = balance * ratePerPeriod;
            const principalPayment = payment - interestPayment;
            
            balance -= principalPayment;
            totalInterest += interestPayment;
            
            // Adjust for final payment rounding
            if (period === totalPeriods) {
                balance = 0;
            }
            
            // Store balance at each year mark
            if (period % periodsPerYear === 0) {
                const year = period / periodsPerYear;
                balanceOverTime.push({
                    year: year,
                    balance: balance
                });
            }
        }
        
        return {
            totalInterest: totalInterest,
            balanceOverTime: balanceOverTime
        };
    }

    // Update chart with loan balance over time
    function updateChart(interestOnlyData, standardData, loanTerm) {
        // Prepare chart data
        const labels = [];
        const interestOnlyBalances = [];
        const standardBalances = [];
        
        // Add data points for each year
        for (let i = 0; i <= loanTerm; i++) {
            labels.push(i);
            
            // Find interest-only balance for this year
            const interestOnlyEntry = interestOnlyData.find(entry => entry.year === i);
            interestOnlyBalances.push(interestOnlyEntry ? interestOnlyEntry.balance : 0);
            
            // Find standard balance for this year
            const standardEntry = standardData.find(entry => entry.year === i);
            standardBalances.push(standardEntry ? standardEntry.balance : 0);
        }
        
        // Update chart data
        loanChart.data.labels = labels;
        loanChart.data.datasets[0].data = interestOnlyBalances; // Interest-only
        loanChart.data.datasets[1].data = standardBalances; // Principal & Interest
        loanChart.update();
    }

    // Reset calculator
    function resetCalculator() {
        // Reset input values
        $('#loan-amount').val('400000');
        $('#interest-rate').val('5.50');
        $('#loan-term').val('30');
        $('#interest-only-period').val('5');
        $('#repayment-frequency').val('monthly');
        
        // Recalculate
        calculateMortgagePayments();
    }

    // Print results
    function printResults() {
        window.print();
    }

    // Initialize calculator
    initializeCalculator();
});