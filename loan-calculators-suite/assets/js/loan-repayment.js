/**
 * Loan Repayment Calculator JavaScript
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
        
        // Calculate loan repayments on load
        calculateLoanRepayments();
    }

    // Set up event listeners
    function setupEventListeners() {
        // Input changes
        $('#loan-amount, #interest-rate, #loan-term, #loan-fee').on('change', function() {
            calculateLoanRepayments();
        });
        
        // Frequency changes
        $('#repayment-frequency, #loan-fee-frequency').on('change', function() {
            calculateLoanRepayments();
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
                        label: 'Loan Balance',
                        data: [],
                        backgroundColor: 'rgba(0, 115, 170, 0.1)',
                        borderColor: 'rgba(0, 115, 170, 1)',
                        borderWidth: 2,
                        pointRadius: 0,
                        pointHitRadius: 10,
                        fill: true
                    },
                    {
                        label: 'Total Payment',
                        data: [],
                        backgroundColor: 'rgba(51, 51, 51, 0.05)',
                        borderColor: 'rgba(51, 51, 51, 0.8)',
                        borderWidth: 2,
                        pointRadius: 0,
                        pointHitRadius: 10,
                        fill: false
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
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

    // Calculate loan repayments
    function calculateLoanRepayments() {
        // Get input values
        const loanAmount = LCS.helpers.getNumericValue($('#loan-amount'));
        const interestRate = LCS.helpers.getNumericValue($('#interest-rate')) / 100;
        const loanTerm = parseInt($('#loan-term').val());
        const loanFee = LCS.helpers.getNumericValue($('#loan-fee'));
        const loanFeeFrequency = $('#loan-fee-frequency').val();
        const repaymentFrequency = $('#repayment-frequency').val();

        // Calculate repayment amount (principal + interest only)
        const baseRepayment = LCS.calculateLoanRepayment(loanAmount, interestRate, loanTerm, repaymentFrequency);

        // Calculate periodic fee to add to repayment (convert all to repayment frequency)
        let periodicFee = 0;
        const freqMap = { monthly: 12, fortnightly: 26, weekly: 52 };
        const periodsPerYear = freqMap[repaymentFrequency];
        if (loanFee > 0) {
            if (loanFeeFrequency === 'monthly') {
                periodicFee = loanFee * 12 / periodsPerYear;
            } else if (loanFeeFrequency === 'annually') {
                periodicFee = loanFee / periodsPerYear;
            } else if (loanFeeFrequency === 'once') {
                const totalPeriods = loanTerm * periodsPerYear;
                periodicFee = loanFee / totalPeriods;
            }
        }
        // Total repayment per period (principal + interest + fee)
        const totalRepayment = baseRepayment + periodicFee;

        // Calculate total interest and fees (pass totalRepayment for amortization)
        const totalInterest = calculateTotalInterestAndFees(loanAmount, totalRepayment, loanTerm, interestRate, loanFee, loanFeeFrequency, repaymentFrequency);
        // Calculate total payments
        const totalPayments = loanAmount + totalInterest;

        // Update results
        const displayFrequency = repaymentFrequency.charAt(0).toUpperCase() + repaymentFrequency.slice(1);
        $(".lcs-result-label[for='monthly-repayment-result'], .lcs-result-label:contains('Repayment')").text(displayFrequency + ' Repayment');
        $('#monthly-repayment-result').text(LCS.formatCurrency(totalRepayment));
        $('#total-interest-result').text(LCS.formatCurrency(totalInterest));
        $('#total-payments-result').text(LCS.formatCurrency(totalPayments));

        // Update chart (pass totalRepayment)
        updateChart(loanAmount, interestRate, loanTerm, totalRepayment, loanFee, loanFeeFrequency, repaymentFrequency);

        // Trigger custom event
        $(document).trigger('calculatorUpdated', {
            calculator: 'loan-repayment',
            loanAmount: loanAmount,
            interestRate: interestRate,
            loanTerm: loanTerm,
            repayment: totalRepayment,
            totalInterest: totalInterest,
            totalPayments: totalPayments
        });
    }

    // Calculate total interest and fees
    function calculateTotalInterestAndFees(loanAmount, repayment, loanTerm, interestRate, loanFee, loanFeeFrequency, repaymentFrequency) {
        // Calculate total interest
        const totalInterest = LCS.calculateTotalInterest(loanAmount, repayment, loanTerm, interestRate, repaymentFrequency);
        
        // Calculate total fees
        let totalFees = 0;
        
        if (loanFee > 0) {
            if (loanFeeFrequency === 'once') {
                totalFees = loanFee;
            } else if (loanFeeFrequency === 'annually') {
                totalFees = loanFee * loanTerm;
            } else if (loanFeeFrequency === 'monthly') {
                totalFees = loanFee * loanTerm * 12;
            }
        }
        
        return totalInterest + totalFees;
    }

    // Update chart with loan balance over time
    function updateChart(loanAmount, interestRate, loanTerm, repayment, loanFee, loanFeeFrequency, repaymentFrequency) {
        // Generate amortization schedule
        const schedule = generateAmortizationSchedule(loanAmount, interestRate, loanTerm, repayment, loanFee, loanFeeFrequency, repaymentFrequency);
        
        // Prepare chart data
        const labels = [];
        const balanceData = [];
        const totalPaymentData = [];
        
        // Add data points for each year
        const periodsPerYear = LCS.FREQUENCY_FACTORS[repaymentFrequency];
        let cumulativePayment = 0;
        
        for (let year = 0; year <= loanTerm; year++) {
            labels.push(year);
            
            if (year === 0) {
                balanceData.push(loanAmount);
                totalPaymentData.push(0);
            } else {
                const periodIndex = Math.min(year * periodsPerYear - 1, schedule.length - 1);
                if (periodIndex >= 0) {
                    balanceData.push(schedule[periodIndex].balance);
                    cumulativePayment += schedule[periodIndex].payment * periodsPerYear;
                    totalPaymentData.push(cumulativePayment);
                } else {
                    balanceData.push(0);
                    totalPaymentData.push(cumulativePayment);
                }
            }
        }
        
        // Update chart data
        loanChart.data.labels = labels;
        loanChart.data.datasets[0].data = balanceData;
        loanChart.data.datasets[1].data = totalPaymentData;
        loanChart.update();
    }

    // Generate amortization schedule
    function generateAmortizationSchedule(loanAmount, interestRate, loanTerm, repayment, loanFee, loanFeeFrequency, repaymentFrequency) {
        const periodsPerYear = LCS.FREQUENCY_FACTORS[repaymentFrequency];
        const ratePerPeriod = interestRate / periodsPerYear;
        const totalPeriods = loanTerm * periodsPerYear;
        
        let schedule = [];
        let balance = loanAmount;
        let totalInterest = 0;
        
        for (let period = 1; period <= totalPeriods; period++) {
            // Add fee if applicable
            let fee = 0;
            if (loanFee > 0) {
                if (loanFeeFrequency === 'monthly' && repaymentFrequency === 'monthly') {
                    fee = loanFee;
                } else if (loanFeeFrequency === 'annually' && period % periodsPerYear === 1) {
                    fee = loanFee;
                } else if (loanFeeFrequency === 'once' && period === 1) {
                    fee = loanFee;
                }
            }
            
            const interestPayment = balance * ratePerPeriod;
            const principalPayment = repayment - interestPayment - fee;
            
            balance -= principalPayment;
            totalInterest += interestPayment + fee;
            
            // Adjust for final payment rounding
            if (period === totalPeriods) {
                balance = 0;
            }
            
            schedule.push({
                period: period,
                payment: repayment,
                principalPayment: principalPayment,
                interestPayment: interestPayment,
                fee: fee,
                totalInterest: totalInterest,
                balance: balance
            });
        }
        
        return schedule;
    }

    // Reset calculator
    function resetCalculator() {
        // Reset input values
        $('#loan-amount').val('400000');
        $('#interest-rate').val('5.5');
        $('#loan-term').val('30');
        $('#loan-fee').val('0');
        $('#loan-fee-frequency').val('monthly');
        $('#repayment-frequency').val('monthly');
        
        // Recalculate
        calculateLoanRepayments();
    }

    // Print results
    function printResults() {
        window.print();
    }

    // Initialize calculator
    initializeCalculator();
});