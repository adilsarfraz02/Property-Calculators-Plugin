/**
 * Extra Repayment Calculator JavaScript
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
        
        // Calculate loan with extra repayments on load
        calculateExtraRepayments();
    }

    // Set up event listeners
    function setupEventListeners() {
        // Input changes
        $('#loan-amount, #interest-rate, #loan-term, #extra-amount').on('change', function() {
            calculateExtraRepayments();
        });
        
        // Frequency changes
        $('#repayment-frequency').on('change', function() {
            calculateExtraRepayments();
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
                        label: 'With Extra',
                        data: [],
                        backgroundColor: 'rgba(0, 115, 170, 0.1)',
                        borderColor: 'rgba(0, 115, 170, 1)',
                        borderWidth: 2,
                        pointRadius: 0,
                        pointHitRadius: 10,
                        fill: true
                    },
                    {
                        label: 'Base Loan',
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

    // Calculate loan with extra repayments
    function calculateExtraRepayments() {
        // Get input values
        const loanAmount = LCS.helpers.getNumericValue($('#loan-amount'));
        const interestRate = LCS.helpers.getNumericValue($('#interest-rate')) / 100;
        const loanTerm = parseInt($('#loan-term').val());
        const extraAmount = LCS.helpers.getNumericValue($('#extra-amount'));
        const repaymentFrequency = $('#repayment-frequency').val();
        
        // Calculate standard repayment amount
        const standardRepayment = LCS.calculateLoanRepayment(loanAmount, interestRate, loanTerm, repaymentFrequency);
        
        // Calculate increased repayment amount
        const increasedRepayment = standardRepayment + extraAmount;
        
        // Calculate loan details with standard repayment
        const standardLoanDetails = calculateLoanDetails(loanAmount, interestRate, loanTerm, standardRepayment, repaymentFrequency);
        
        // Calculate loan details with increased repayment
        const increasedLoanDetails = calculateLoanDetails(loanAmount, interestRate, loanTerm, increasedRepayment, repaymentFrequency);
        
        // Calculate time saved
        const timeSavedMonths = standardLoanDetails.totalMonths - increasedLoanDetails.totalMonths;
        const timeSavedFormatted = formatTimeSaved(timeSavedMonths);
        
        // Calculate interest saved
        const interestSaved = standardLoanDetails.totalInterest - increasedLoanDetails.totalInterest;
        
        // Update results
        $('#minimum-repayment-result').text(LCS.formatCurrency(standardRepayment));
        $('#increased-repayment-result').text(LCS.formatCurrency(increasedRepayment));
        $('#time-saved-result').text(timeSavedFormatted);
        $('#interest-saved-result').text(LCS.formatCurrency(interestSaved));
        
        // Update chart
        updateChart(standardLoanDetails.balanceOverTime, increasedLoanDetails.balanceOverTime, loanTerm);
        
        // Trigger custom event
        $(document).trigger('calculatorUpdated', {
            calculator: 'extra-repayment',
            loanAmount: loanAmount,
            interestRate: interestRate,
            loanTerm: loanTerm,
            standardRepayment: standardRepayment,
            increasedRepayment: increasedRepayment,
            timeSaved: timeSavedMonths,
            interestSaved: interestSaved
        });
    }

    // Calculate loan details
    function calculateLoanDetails(loanAmount, interestRate, loanTerm, repayment, repaymentFrequency) {
        const periodsPerYear = LCS.FREQUENCY_FACTORS[repaymentFrequency];
        const ratePerPeriod = interestRate / periodsPerYear;
        const totalPeriods = loanTerm * periodsPerYear;
        
        let balance = loanAmount;
        let totalInterest = 0;
        let period = 0;
        let balanceOverTime = [];
        
        // Add initial balance
        balanceOverTime.push({
            year: 0,
            balance: balance
        });
        
        // Calculate amortization
        while (balance > 0 && period < totalPeriods) {
            period++;
            
            const interestPayment = balance * ratePerPeriod;
            const principalPayment = Math.min(repayment - interestPayment, balance);
            
            balance -= principalPayment;
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
        
        // If we paid off the loan early, add the final year with zero balance
        if (period < totalPeriods && balanceOverTime.length <= loanTerm) {
            const finalYear = Math.ceil(period / periodsPerYear);
            balanceOverTime.push({
                year: finalYear,
                balance: 0
            });
        }
        
        // Fill in remaining years up to loan term if needed
        while (balanceOverTime.length <= loanTerm) {
            const year = balanceOverTime.length;
            balanceOverTime.push({
                year: year,
                balance: 0
            });
        }
        
        return {
            totalMonths: Math.ceil(period / (periodsPerYear / 12)),
            totalInterest: totalInterest,
            balanceOverTime: balanceOverTime
        };
    }

    // Format time saved as years and months
    function formatTimeSaved(months) {
        const years = Math.floor(months / 12);
        const remainingMonths = months % 12;
        
        let result = '';
        
        if (years > 0) {
            result += years + ' year' + (years !== 1 ? 's' : '');
        }
        
        if (remainingMonths > 0) {
            if (result.length > 0) {
                result += ', ';
            }
            result += remainingMonths + ' month' + (remainingMonths !== 1 ? 's' : '');
        }
        
        return result.length > 0 ? result : '0 months';
    }

    // Update chart with loan balance over time
    function updateChart(standardBalanceData, increasedBalanceData, loanTerm) {
        // Prepare chart data
        const labels = [];
        const standardBalances = [];
        const increasedBalances = [];
        
        // Add data points for each year
        for (let i = 0; i <= loanTerm; i++) {
            labels.push(i);
            
            // Find standard balance for this year
            const standardEntry = standardBalanceData.find(entry => entry.year === i);
            standardBalances.push(standardEntry ? standardEntry.balance : 0);
            
            // Find increased balance for this year
            const increasedEntry = increasedBalanceData.find(entry => entry.year === i);
            increasedBalances.push(increasedEntry ? increasedEntry.balance : 0);
        }
        
        // Update chart data
        loanChart.data.labels = labels;
        loanChart.data.datasets[0].data = increasedBalances; // With extra repayments
        loanChart.data.datasets[1].data = standardBalances; // Standard repayments
        loanChart.update();
    }

    // Reset calculator
    function resetCalculator() {
        // Reset input values
        $('#loan-amount').val('350000');
        $('#interest-rate').val('5.50');
        $('#loan-term').val('30');
        $('#extra-amount').val('100');
        $('#repayment-frequency').val('monthly');
        
        // Recalculate
        calculateExtraRepayments();
    }

    // Print results
    function printResults() {
        window.print();
    }

    // Initialize calculator
    initializeCalculator();
});