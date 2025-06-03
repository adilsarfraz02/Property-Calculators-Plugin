<?php
/**
 * Template for Borrowing Power Calculator
 *
 * @package Loan_Calculators_Suite
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}
?>
<div class="lcs-calculator borrowing-power-calculator">
    <h2><?php echo esc_html($atts['title']); ?></h2>
    
    <div class="lcs-calculator-container">
        <!-- Income Details Section -->
        <div class="lcs-calculator-section">
            <h3>Enter your income details</h3>
            
            <div class="lcs-form-group">
                <label>Joint Income</label>
                <div class="lcs-toggle-group" id="joint-income-toggle">
                    <button type="button" class="lcs-toggle-btn active" data-value="no">No</button>
                    <button type="button" class="lcs-toggle-btn" data-value="yes">Yes</button>
                </div>
                <input type="hidden" id="joint-income" value="no">
            </div>

            <div class="lcs-form-group">
                <label>Dependent Children</label>
                <div class="lcs-number-group" id="dependent-children-group">
                    <button type="button" class="lcs-number-btn active" data-value="0">0</button>
                    <button type="button" class="lcs-number-btn" data-value="1">1</button>
                    <button type="button" class="lcs-number-btn" data-value="2">2</button>
                    <button type="button" class="lcs-number-btn" data-value="3">3+</button>
                </div>
                <input type="hidden" id="dependent-children" value="0">
            </div>

            <div class="lcs-form-group">
                <label>Income type</label>
                <div class="lcs-toggle-group" id="income-type-toggle">
                    <button type="button" class="lcs-toggle-btn active" data-value="payg">PAYG</button>
                    <button type="button" class="lcs-toggle-btn" data-value="self-employed">Self-employed</button>
                </div>
                <input type="hidden" id="income-type" value="payg">
            </div>

            <div class="lcs-form-group">
                <label>Salary 1</label>
                <div class="lcs-input-group">
                    <span class="lcs-currency">$</span>
                    <input type="text" id="salary1" value="80000" class="lcs-currency-input" data-type="currency">
                    <select id="salary1-frequency" class="lcs-frequency-select">
                        <option value="annually">Annually</option>
                        <option value="monthly">Monthly</option>
                        <option value="fortnightly">Fortnightly</option>
                        <option value="weekly">Weekly</option>
                    </select>
                </div>
            </div>

            <div class="lcs-form-group salary2-group" id="salary2-group">
                <label>Salary 2</label>
                <div class="lcs-input-group">
                    <span class="lcs-currency">$</span>
                    <input type="text" id="salary2" value="60000" class="lcs-currency-input" data-type="currency">
                    <select id="salary2-frequency" class="lcs-frequency-select">
                        <option value="annually">Annually</option>
                        <option value="monthly">Monthly</option>
                        <option value="fortnightly">Fortnightly</option>
                        <option value="weekly">Weekly</option>
                    </select>
                </div>
            </div>

            <div class="lcs-form-group">
                <label>Other Income</label>
                <div class="lcs-input-group">
                    <span class="lcs-currency">$</span>
                    <input type="text" id="other-income" value="0" class="lcs-currency-input" data-type="currency">
                    <select id="other-income-frequency" class="lcs-frequency-select">
                        <option value="annually">Annually</option>
                        <option value="monthly">Monthly</option>
                        <option value="fortnightly">Fortnightly</option>
                        <option value="weekly">Weekly</option>
                    </select>
                </div>
            </div>
        </div>

        <!-- Expense Details Section -->
        <div class="lcs-calculator-section">
            <h3>Enter your expense details</h3>
            
            <div class="lcs-form-group">
                <label>Living expenses</label>
                <div class="lcs-input-group">
                    <span class="lcs-currency">$</span>
                    <input type="text" id="living-expenses" value="3000" class="lcs-currency-input" data-type="currency">
                    <select id="living-expenses-frequency" class="lcs-frequency-select">
                        <option value="monthly">Monthly</option>
                        <option value="annually">Annually</option>
                        <option value="fortnightly">Fortnightly</option>
                        <option value="weekly">Weekly</option>
                    </select>
                </div>
            </div>

            <div class="lcs-form-group">
                <label>Existing loan repayments</label>
                <div class="lcs-input-group">
                    <span class="lcs-currency">$</span>
                    <input type="text" id="existing-loan-repayments" value="0" class="lcs-currency-input" data-type="currency">
                    <select id="existing-loan-frequency" class="lcs-frequency-select">
                        <option value="monthly">Monthly</option>
                        <option value="annually">Annually</option>
                        <option value="fortnightly">Fortnightly</option>
                        <option value="weekly">Weekly</option>
                    </select>
                </div>
            </div>

            <div class="lcs-form-group">
                <label>Credit card limits</label>
                <div class="lcs-input-group">
                    <span class="lcs-currency">$</span>
                    <input type="text" id="credit-card-limits" value="0" class="lcs-currency-input" data-type="currency">
                </div>
            </div>

            <div class="lcs-form-group">
                <label>Interest rate</label>
                <div class="lcs-input-group">
                    <input type="text" id="interest-rate" value="5.75" class="lcs-rate-input" data-type="rate">
                    <span class="lcs-percentage">%</span>
                </div>
                <p class="lcs-note">The interest rate used for serviceability assessment</p>
            </div>

            <div class="lcs-form-group">
                <label>Loan term</label>
                <div class="lcs-input-group">
                    <input type="text" id="loan-term" value="30" class="lcs-number-input" data-type="number">
                    <span class="lcs-unit">years</span>
                </div>
            </div>
        </div>
    </div>

    <!-- Results Section -->
    <div class="lcs-results-section">
        <h3>Your Borrowing Power</h3>
        
        <div class="lcs-result-value" id="borrowing-power-result">$500,000</div>
        <div class="lcs-result-label">Maximum loan amount</div>
        
        <div class="lcs-result-details">
            <div class="lcs-result-item">
                <span class="lcs-result-label">Monthly repayment:</span>
                <span class="lcs-result-value" id="monthly-repayment-result">$2,918</span>
            </div>
            <div class="lcs-result-item">
                <span class="lcs-result-label">Total interest payable:</span>
                <span class="lcs-result-value" id="total-interest-result">$550,480</span>
            </div>
        </div>
    </div>

    <!-- Chart Section -->
    <div class="lcs-chart-container">
        <h3>Loan Balance Over Time</h3>
        <div class="lcs-chart-wrapper">
            <canvas id="loan-balance-chart"></canvas>
        </div>
    </div>

    <!-- Action Buttons -->
    <div class="lcs-btn-group">
        <button type="button" class="lcs-btn lcs-btn-secondary" id="reset-calculator">Reset</button>
        <button type="button" class="lcs-btn lcs-modal-open" data-modal="assumptions-modal">View Assumptions</button>
        <button type="button" class="lcs-btn" id="print-results">Print Results</button>
    </div>

    <!-- Assumptions Modal -->
    <div id="assumptions-modal" class="lcs-modal">
        <div class="lcs-modal-content">
            <div class="lcs-modal-header">
                <h3>Calculation Assumptions</h3>
                <span class="lcs-modal-close">&times;</span>
            </div>
            <div class="lcs-modal-body">
                <p>The borrowing power calculator uses the following assumptions:</p>
                <ul>
                    <li>Assessment rate: <span id="assessment-rate">8.75%</span> (interest rate + 3% buffer)</li>
                    <li>Debt service ratio: <span id="debt-service-ratio">30%</span> of gross income</li>
                    <li>Living expenses based on household composition</li>
                    <li>Credit card repayments calculated at 3% of total limits</li>
                </ul>
                <p>This calculator provides an estimate only. Actual borrowing capacity may vary based on lender criteria.</p>
            </div>
            <div class="lcs-modal-footer">
                <button type="button" class="lcs-btn lcs-modal-cancel">Close</button>
            </div>
        </div>
    </div>
</div>