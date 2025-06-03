/**
 * How Long To Repay Calculator JavaScript
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
        
        // Calculate loan term on load
        calculateLoanTerm();
    }

    // Set up event listeners
    function setupEventListeners() {
        // Input changes
        $('#loan-amount, #interest-rate, #repayment').on('change', function() {
            calculateLoanTerm();
        });
        
        // Frequency changes
        $('#repayment-frequency').on('change', function() {
            calculateLoanTerm();
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
                            text: 'Amount Owing'
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

    // Calculate loan term
    function calculateLoanTerm() {
        // Get input values
        const loanAmount = LCS.helpers.getNumericValue($('#loan-amount'));
        const interestRate = LCS.helpers.getNumericValue($('#interest-rate')) / 100;
        const repayment = LCS.helpers.getNumericValue($('#repayment'));
        const repaymentFrequency = $('#repayment-frequency').val();
        
        // Calculate loan term in years
        const loanTermYears = LCS.calculateLoanTerm(loanAmount, repayment, interestRate, repaymentFrequency);
        
        // Calculate total payments
        const totalPayments = calculateTotalPayments(loanTermYears, repayment, repaymentFrequency);
        
        // Calculate total interest
        const totalInterest = totalPayments - loanAmount;
        
        // Format loan term as years and months
        const formattedLoanTerm = formatLoanTerm(loanTermYears);
        
        // Update results
        $('#loan-term-result').text(formattedLoanTerm);
        $('#total-interest-result').text(LCS.formatCurrency(totalInterest));
        $('#total-payments-result').text(LCS.formatCurrency(totalPayments));
        
        // Update chart
        updateChart(loanAmount, interestRate, loanTermYears, repayment, repaymentFrequency);
        
        // Trigger custom event
        $(document).trigger('calculatorUpdated', {
            calculator: 'how-long-to-repay',
            loanAmount: loanAmount,
            interestRate: interestRate,
            repayment: repayment,
            repaymentFrequency: repaymentFrequency,
            loanTermYears: loanTermYears,
            totalInterest: totalInterest,
            totalPayments: totalPayments
        });
    }

    // Calculate total payments
    function calculateTotalPayments(loanTermYears, repayment, frequency) {
        const periodsPerYear = LCS.FREQUENCY_FACTORS[frequency];
        const totalPeriods = Math.ceil(loanTermYears * periodsPerYear);
        return repayment * totalPeriods;
    }

    // Format loan term as years and months
    function formatLoanTerm(loanTermYears) {
        const years = Math.floor(loanTermYears);
        const months = Math.round((loanTermYears - years) * 12);
        
        if (months === 12) {
            return (years + 1) + ' years';
        } else if (years === 0) {
            return months + ' months';
        } else if (years === 1 && months === 0) {
            return '1 year';
        } else if (years === 1) {
            return '1 year, ' + months + ' months';
        } else if (months === 0) {
            return years + ' years';
        } else {
            return years + ' years, ' + months + ' months';
        }
    }

    // Update chart with loan balance over time
    function updateChart(loanAmount, interestRate, loanTermYears, repayment, frequency) {
        // Generate amortization schedule
        const schedule = generateAmortizationSchedule(loanAmount, interestRate, loanTermYears, repayment, frequency);
        
        // Prepare chart data
        const labels = [];
        const balanceData = [];
        const totalPaymentData = [];
        
        // Add data points for each year
        const maxYears = Math.ceil(loanTermYears);
        let cumulativePayment = 0;
        
        for (let year = 0; year <= maxYears; year++) {
            labels.push(year);
            
            if (year === 0) {
                balanceData.push(loanAmount);
                totalPaymentData.push(0);
            } else {
                const periodIndex = Math.min(year * LCS.FREQUENCY_FACTORS[frequency] - 1, schedule.length - 1);
                if (periodIndex >= 0 && periodIndex < schedule.length) {
                    balanceData.push(schedule[periodIndex].balance);
                    cumulativePayment += schedule[periodIndex].payment * LCS.FREQUENCY_FACTORS[frequency];
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
    function generateAmortizationSchedule(loanAmount, interestRate, loanTermYears, repayment, frequency) {
        const periodsPerYear = LCS.FREQUENCY_FACTORS[frequency];
        const ratePerPeriod = interestRate / periodsPerYear;
        const totalPeriods = Math.ceil(loanTermYears * periodsPerYear);
        
        let schedule = [];
        let balance = loanAmount;
        let totalInterest = 0;
        
        for (let period = 1; period <= totalPeriods; period++) {
            const interestPayment = balance * ratePerPeriod;
            let principalPayment = repayment - interestPayment;
            
            // Adjust final payment if needed
            if (principalPayment > balance) {
                principalPayment = balance;
                balance = 0;
            } else {
                balance -= principalPayment;
            }
            
            totalInterest += interestPayment;
            
            schedule.push({
                period: period,
                payment: principalPayment + interestPayment,
                principalPayment: principalPayment,
                interestPayment: interestPayment,
                totalInterest: totalInterest,
                balance: balance
            });
            
            // Stop if loan is fully paid
            if (balance <= 0) {
                break;
            }
        }
        
        return schedule;
    }

    // Reset calculator
    function resetCalculator() {
        // Reset input values
        $('#loan-amount').val('250000');
        $('#interest-rate').val('5.00');
        $('#repayment').val('2000');
        $('#repayment-frequency').val('monthly');
        
        // Recalculate
        calculateLoanTerm();
    }

    // Print results
    function printResults() {
        window.print();
    }

    // Initialize calculator
    initializeCalculator();
});