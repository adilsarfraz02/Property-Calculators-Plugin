/**
 * Borrowing Power Calculator JavaScript
 */

jQuery(document).ready(function($) {
    // Chart instance
    let loanChart = null;

    // Initialize the calculator
    function initializeCalculator() {
        // Hide salary2 group initially
        $('#salary2-group').hide();
        
        // Setup event listeners
        setupEventListeners();
        
        // Initialize chart
        initializeChart();
        
        // Calculate borrowing power on load
        calculateBorrowingPower();
    }

    // Set up event listeners
    function setupEventListeners() {
        // Joint income toggle
        $('#joint-income-toggle .lcs-toggle-btn').click(function() {
            const jointIncome = $('#joint-income').val();
            if (jointIncome === 'yes') {
                $('#salary2-group').show();
            } else {
                $('#salary2-group').hide();
            }
            calculateBorrowingPower();
        });
        
        // Input changes
        $('.lcs-currency-input, .lcs-rate-input, .lcs-number-input').on('change', function() {
            calculateBorrowingPower();
        });
        
        // Frequency changes
        $('.lcs-frequency-select').on('change', function() {
            calculateBorrowingPower();
        });
        
        // Toggle and number button changes
        $('#dependent-children, #income-type').on('change', function() {
            calculateBorrowingPower();
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
                datasets: [{
                    label: 'Loan Balance',
                    data: [],
                    backgroundColor: 'rgba(0, 115, 170, 0.1)',
                    borderColor: 'rgba(0, 115, 170, 1)',
                    borderWidth: 2,
                    pointRadius: 0,
                    pointHitRadius: 10,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return 'Balance: ' + LCS.formatCurrency(context.parsed.y);
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
                            text: 'Loan Balance'
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

    // Calculate borrowing power
    function calculateBorrowingPower() {
        // Get input values
        const jointIncome = $('#joint-income').val();
        const dependentChildren = parseInt($('#dependent-children').val());
        const incomeType = $('#income-type').val();
        
        // Get salary 1
        const salary1 = LCS.helpers.getNumericValue($('#salary1'));
        const salary1Frequency = $('#salary1-frequency').val();
        const annualSalary1 = LCS.convertPaymentFrequency(salary1, salary1Frequency, 'annually');
        
        // Get salary 2 (if joint income)
        let annualSalary2 = 0;
        if (jointIncome === 'yes') {
            const salary2 = LCS.helpers.getNumericValue($('#salary2'));
            const salary2Frequency = $('#salary2-frequency').val();
            annualSalary2 = LCS.convertPaymentFrequency(salary2, salary2Frequency, 'annually');
        }
        
        // Get other income
        const otherIncome = LCS.helpers.getNumericValue($('#other-income'));
        const otherIncomeFrequency = $('#other-income-frequency').val();
        const annualOtherIncome = LCS.convertPaymentFrequency(otherIncome, otherIncomeFrequency, 'annually');
        
        // Calculate total annual income
        const totalAnnualIncome = annualSalary1 + annualSalary2 + annualOtherIncome;
        
        // Get expenses
        const livingExpenses = LCS.helpers.getNumericValue($('#living-expenses'));
        const livingExpensesFrequency = $('#living-expenses-frequency').val();
        const annualLivingExpenses = LCS.convertPaymentFrequency(livingExpenses, livingExpensesFrequency, 'annually');
        
        // Get existing loan repayments
        const existingLoanRepayments = LCS.helpers.getNumericValue($('#existing-loan-repayments'));
        const existingLoanFrequency = $('#existing-loan-frequency').val();
        const annualExistingLoanRepayments = LCS.convertPaymentFrequency(existingLoanRepayments, existingLoanFrequency, 'annually');
        
        // Get credit card limits
        const creditCardLimits = LCS.helpers.getNumericValue($('#credit-card-limits'));
        const annualCreditCardRepayments = creditCardLimits * 0.03 * 12; // 3% of limits per month
        
        // Get interest rate and loan term
        const interestRate = LCS.helpers.getNumericValue($('#interest-rate')) / 100;
        const loanTerm = parseInt($('#loan-term').val());
        
        // Calculate assessment rate (interest rate + buffer, minimum floor rate)
        const bufferRate = LCS.BUFFER_RATE;
        const floorRate = LCS.FLOOR_RATE;
        const assessmentRate = Math.max(interestRate + bufferRate, floorRate);
        
        // Update assessment rate in assumptions modal
        $('#assessment-rate').text((assessmentRate * 100).toFixed(2) + '%');
        
        // Calculate monthly income
        const monthlyIncome = totalAnnualIncome / 12;
        
        // Calculate monthly expenses
        const monthlyLivingExpenses = annualLivingExpenses / 12;
        const monthlyExistingLoanRepayments = annualExistingLoanRepayments / 12;
        const monthlyCreditCardRepayments = annualCreditCardRepayments / 12;
        const totalMonthlyExpenses = monthlyLivingExpenses + monthlyExistingLoanRepayments + monthlyCreditCardRepayments;
        
        // Calculate debt service ratio (30% of gross income)
        const debtServiceRatio = 0.3;
        $('#debt-service-ratio').text((debtServiceRatio * 100).toFixed(0) + '%');
        
        // Calculate maximum monthly repayment capacity
        const maxMonthlyRepayment = (monthlyIncome * debtServiceRatio) - monthlyExistingLoanRepayments - monthlyCreditCardRepayments;
        
        // Calculate maximum loan amount
        const monthlyRate = assessmentRate / 12;
        const totalPayments = loanTerm * 12;
        
        let maxLoanAmount = 0;
        if (monthlyRate === 0) {
            maxLoanAmount = maxMonthlyRepayment * totalPayments;
        } else {
            maxLoanAmount = maxMonthlyRepayment * (1 - Math.pow(1 + monthlyRate, -totalPayments)) / monthlyRate;
        }
        
        // Apply income type adjustment
        if (incomeType === 'self-employed') {
            maxLoanAmount *= 0.9; // 10% reduction for self-employed
        }
        
        // Apply dependent children adjustment
        if (dependentChildren > 0) {
            const childrenFactor = 1 - (dependentChildren * 0.05); // 5% reduction per child
            maxLoanAmount *= Math.max(childrenFactor, 0.85); // Maximum 15% reduction
        }
        
        // Round to nearest $1,000
        maxLoanAmount = Math.floor(maxLoanAmount / 1000) * 1000;
        
        // Calculate monthly repayment for the maximum loan amount
        const monthlyRepayment = LCS.calculateLoanRepayment(maxLoanAmount, interestRate, loanTerm, 'monthly');
        
        // Calculate total interest payable
        const totalInterest = LCS.calculateTotalInterest(maxLoanAmount, monthlyRepayment, loanTerm, interestRate, 'monthly');
        
        // Update results
        $('#borrowing-power-result').text(LCS.formatCurrency(maxLoanAmount));
        $('#monthly-repayment-result').text(LCS.formatCurrency(monthlyRepayment));
        $('#total-interest-result').text(LCS.formatCurrency(totalInterest));
        
        // Update chart
        updateChart(maxLoanAmount, interestRate, loanTerm);
        
        // Trigger custom event
        $(document).trigger('calculatorUpdated', {
            calculator: 'borrowing-power',
            maxLoanAmount: maxLoanAmount,
            monthlyRepayment: monthlyRepayment,
            totalInterest: totalInterest,
            interestRate: interestRate,
            loanTerm: loanTerm
        });
    }

    // Update chart with loan balance over time
    function updateChart(loanAmount, interestRate, loanTerm) {
        // Generate amortization schedule
        const schedule = LCS.generateAmortizationSchedule(loanAmount, interestRate, loanTerm, 'monthly');
        
        // Prepare chart data
        const labels = [];
        const data = [];
        
        // Add data points for each year
        for (let year = 0; year <= loanTerm; year++) {
            labels.push(year);
            
            if (year === 0) {
                data.push(loanAmount);
            } else {
                const periodIndex = year * 12 - 1;
                if (periodIndex < schedule.length) {
                    data.push(schedule[periodIndex].balance);
                } else {
                    data.push(0);
                }
            }
        }
        
        // Update chart data
        loanChart.data.labels = labels;
        loanChart.data.datasets[0].data = data;
        loanChart.update();
    }

    // Reset calculator
    function resetCalculator() {
        // Reset toggle buttons
        $('#joint-income-toggle .lcs-toggle-btn[data-value="no"]').click();
        $('#dependent-children-group .lcs-number-btn[data-value="0"]').click();
        $('#income-type-toggle .lcs-toggle-btn[data-value="payg"]').click();
        
        // Reset input values
        $('#salary1').val('80000');
        $('#salary1-frequency').val('annually');
        $('#salary2').val('60000');
        $('#salary2-frequency').val('annually');
        $('#other-income').val('0');
        $('#other-income-frequency').val('annually');
        $('#living-expenses').val('3000');
        $('#living-expenses-frequency').val('monthly');
        $('#existing-loan-repayments').val('0');
        $('#existing-loan-frequency').val('monthly');
        $('#credit-card-limits').val('0');
        $('#interest-rate').val('5.75');
        $('#loan-term').val('30');
        
        // Recalculate
        calculateBorrowingPower();
    }

    // Print results
    function printResults() {
        window.print();
    }

    // Initialize calculator
    initializeCalculator();
});