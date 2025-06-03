/**
 * Home Loan Offset Calculator JavaScript
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
        
        // Calculate loan with offset on load
        calculateOffsetImpact();
    }

    // Set up event listeners
    function setupEventListeners() {
        // Input changes
        $('#loan-amount, #interest-rate, #loan-term, #offset-amount').on('change', function() {
            calculateOffsetImpact();
        });
        
        // Frequency changes
        $('#repayment-frequency').on('change', function() {
            calculateOffsetImpact();
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
                        label: 'With Offset',
                        data: [],
                        backgroundColor: 'rgba(0, 115, 170, 0.1)',
                        borderColor: 'rgba(0, 115, 170, 1)',
                        borderWidth: 2,
                        pointRadius: 0,
                        pointHitRadius: 10,
                        fill: true
                    },
                    {
                        label: 'Without Offset',
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

    // Calculate offset impact
    function calculateOffsetImpact() {
        // Get input values
        const loanAmount = LCS.helpers.getNumericValue($('#loan-amount'));
        const interestRate = LCS.helpers.getNumericValue($('#interest-rate')) / 100;
        const loanTerm = parseInt($('#loan-term').val());
        const offsetAmount = LCS.helpers.getNumericValue($('#offset-amount'));
        const repaymentFrequency = $('#repayment-frequency').val();
        
        // Calculate standard repayment amount (without offset)
        const standardRepayment = LCS.calculateLoanRepayment(loanAmount, interestRate, loanTerm, repaymentFrequency);
        
        // Calculate loan details without offset
        const standardLoanDetails = calculateLoanDetails(loanAmount, interestRate, loanTerm, standardRepayment, 0, repaymentFrequency);
        
        // Calculate loan details with offset
        const offsetLoanDetails = calculateLoanDetails(loanAmount, interestRate, loanTerm, standardRepayment, offsetAmount, repaymentFrequency);
        
        // Calculate time saved
        const timeSavedMonths = standardLoanDetails.totalMonths - offsetLoanDetails.totalMonths;
        const timeSavedFormatted = formatTimeSaved(timeSavedMonths);
        
        // Calculate interest saved
        const interestSaved = standardLoanDetails.totalInterest - offsetLoanDetails.totalInterest;
        
        // Calculate effective interest rate
        const effectiveRate = calculateEffectiveRate(loanAmount, offsetAmount, interestRate);
        
        // Update results
        $('#standard-repayment-result').text(LCS.formatCurrency(standardRepayment));
        $('#effective-repayment-result').text(LCS.formatCurrency(standardRepayment)); // Same payment amount, but less interest
        $('#time-saved-result').text(timeSavedFormatted);
        $('#interest-saved-result').text(LCS.formatCurrency(interestSaved));
        
        // Update chart
        updateChart(standardLoanDetails.balanceOverTime, offsetLoanDetails.balanceOverTime, loanTerm);
        
        // Trigger custom event
        $(document).trigger('calculatorUpdated', {
            calculator: 'home-loan-offset',
            loanAmount: loanAmount,
            interestRate: interestRate,
            loanTerm: loanTerm,
            offsetAmount: offsetAmount,
            standardRepayment: standardRepayment,
            timeSaved: timeSavedMonths,
            interestSaved: interestSaved
        });
    }

    // Calculate effective interest rate with offset
    function calculateEffectiveRate(loanAmount, offsetAmount, interestRate) {
        if (loanAmount <= 0 || offsetAmount >= loanAmount) {
            return 0;
        }
        
        const effectiveBalance = loanAmount - offsetAmount;
        const effectiveRate = (effectiveBalance / loanAmount) * interestRate;
        
        return effectiveRate;
    }

    // Calculate loan details
    function calculateLoanDetails(loanAmount, interestRate, loanTerm, repayment, offsetAmount, repaymentFrequency) {
        const periodsPerYear = LCS.FREQUENCY_FACTORS[repaymentFrequency];
        const ratePerPeriod = interestRate / periodsPerYear;
        const totalPeriods = loanTerm * periodsPerYear;
        
        let balance = loanAmount;
        let totalInterest = 0;
        let period = 0;
        let balanceOverTime = [];
        
        // Ensure offset amount doesn't exceed loan amount
        offsetAmount = Math.min(offsetAmount, loanAmount);
        
        // Add initial balance
        balanceOverTime.push({
            year: 0,
            balance: balance
        });
        
        // Calculate amortization
        while (balance > 0 && period < totalPeriods) {
            period++;
            
            // Calculate interest on effective balance (loan amount - offset amount)
            const effectiveBalance = Math.max(0, balance - offsetAmount);
            const interestPayment = effectiveBalance * ratePerPeriod;
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
    function updateChart(standardBalanceData, offsetBalanceData, loanTerm) {
        // Prepare chart data
        const labels = [];
        const standardBalances = [];
        const offsetBalances = [];
        
        // Add data points for each year
        for (let i = 0; i <= loanTerm; i++) {
            labels.push(i);
            
            // Find standard balance for this year
            const standardEntry = standardBalanceData.find(entry => entry.year === i);
            standardBalances.push(standardEntry ? standardEntry.balance : 0);
            
            // Find offset balance for this year
            const offsetEntry = offsetBalanceData.find(entry => entry.year === i);
            offsetBalances.push(offsetEntry ? offsetEntry.balance : 0);
        }
        
        // Update chart data
        loanChart.data.labels = labels;
        loanChart.data.datasets[0].data = offsetBalances; // With offset
        loanChart.data.datasets[1].data = standardBalances; // Without offset
        loanChart.update();
    }

    // Reset calculator
    function resetCalculator() {
        // Reset input values
        $('#loan-amount').val('400000');
        $('#interest-rate').val('5.50');
        $('#loan-term').val('30');
        $('#offset-amount').val('10000');
        $('#repayment-frequency').val('monthly');
        
        // Recalculate
        calculateOffsetImpact();
    }

    // Print results
    function printResults() {
        window.print();
    }

    // Initialize calculator
    initializeCalculator();
});