<?php
/**
 * Template for Loan Repayment Calculator
 *
 * @package Loan_Calculators_Suite
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}
?>
<div class="lcs-calculator loan-repayment-calculator">
    <h2><?php echo esc_html($atts['title']); ?></h2>
    
    <div class="lcs-calculator-container">
        <!-- Input Details Section -->
        <div class="lcs-calculator-section">
            <h3>Enter your details</h3>
            
            <div class="lcs-form-group">
                <label>Loan Amount</label>
                <div class="lcs-input-group">
                    <span class="lcs-currency">$</span>
                    <input type="text" id="loan-amount" value="400000" class="lcs-currency-input" data-type="currency">
                </div>
            </div>

            <div class="lcs-form-group">
                <label>Interest Rate</label>
                <div class="lcs-input-group">
                    <input type="text" id="interest-rate" value="5.5" class="lcs-rate-input" data-type="rate">
                    <span class="lcs-percentage">%</span>
                </div>
            </div>

            <div class="lcs-form-group">
                <label>Loan Term</label>
                <div class="lcs-input-group">
                    <input type="text" id="loan-term" value="30" class="lcs-number-input" data-type="number">
                    <span class="lcs-unit">years</span>
                </div>
            </div>

            <div class="lcs-form-group">
                <label>Loan Fee</label>
                <div class="lcs-input-group">
                    <span class="lcs-currency">$</span>
                    <input type="text" id="loan-fee" value="0" class="lcs-currency-input" data-type="currency">
                    <select id="loan-fee-frequency" class="lcs-frequency-select">
                        <option value="monthly">Monthly</option>
                        <option value="annually">Annually</option>
                        <option value="once">Once</option>
                    </select>
                </div>
            </div>

            <div class="lcs-form-group">
                <label>Repayment Frequency</label>
                <div class="lcs-input-group">
                    <select id="repayment-frequency" class="lcs-frequency-select full-width">
                        <option value="monthly">Monthly</option>
                        <option value="fortnightly">Fortnightly</option>
                        <option value="weekly">Weekly</option>
                    </select>
                </div>
            </div>

            <div class="lcs-btn-group">
                <button type="button" class="lcs-btn lcs-btn-secondary" id="reset-calculator">Reset</button>
            </div>
        </div>

        <!-- Chart Section -->
        <div class="lcs-calculator-section">
            <h3>Loan Balance Chart</h3>
            <div class="lcs-chart-wrapper">
                <canvas id="loan-balance-chart"></canvas>
            </div>
        </div>
    </div>

    <!-- Results Section -->
    <div class="lcs-results-section">
        <h3>View your results</h3>
        
        <div class="lcs-result-details">
            <div class="lcs-result-item">
                <span class="lcs-result-label" for="monthly-repayment-result">Monthly Repayment</span>
                <span class="lcs-result-value" id="monthly-repayment-result">$2,271.16</span>
                <span class="lcs-result-note" id="repayment-includes-fee" style="display:block;font-size:12px;color:#888;">(Includes loan fee if applicable)</span>
            </div>
            <div class="lcs-result-item">
                <span class="lcs-result-label">Total Interest / Fee Payable</span>
                <span class="lcs-result-value" id="total-interest-result">$417,616</span>
            </div>
            <div class="lcs-result-item">
                <span class="lcs-result-label">Total Payments</span>
                <span class="lcs-result-value" id="total-payments-result">$817,616</span>
            </div>
        </div>

        <!-- Action Buttons -->
        <div class="lcs-btn-group">
            <button type="button" class="lcs-btn" id="print-results">Print</button>
            <button type="button" class="lcs-btn lcs-modal-open" data-modal="assumptions-modal">Assumption</button>
        </div>
    </div>

    <!-- Assumptions Modal -->
    <div id="assumptions-modal" class="lcs-modal">
        <div class="lcs-modal-content">
            <div class="lcs-modal-header">
                <h3>Description</h3>
                <span class="lcs-modal-close">&times;</span>
            </div>
            <div class="lcs-modal-body">
                <p>This calculator helps you determine your loan repayments and total cost over the life of the loan.</p>
                <h4>Assumptions</h4>
                <ul>
                    <li>Interest rate remains constant for the entire loan term.</li>
                    <li>Repayments are made regularly at the selected frequency without any missed payments.</li>
                    <li>Any loan fees are either paid upfront (once), annually, or monthly as selected.</li>
                    <li>Interest is calculated by compounding on the same repayment frequency selected.</li>
                    <li>A year consists of 12 months, 26 fortnights, or 52 weeks depending on the selected frequency.</li>
                    <li>Repayments are rounded to the nearest cent.</li>
                </ul>
            </div>
            <div class="lcs-modal-footer">
                <button type="button" class="lcs-btn lcs-modal-cancel">Close</button>
            </div>
        </div>
    </div>

    <!-- Disclaimer Note -->
    <div class="lcs-disclaimer">
        <p class="lcs-note">Note: The information provided by the calculator is intended to provide illustrative examples based on stated assumptions and your inputs. Calculations are meant as estimates only and it is advised that you consult with a mortgage broker about your specific circumstances. Financial Calculators © VisionWidgets Pty Ltd 2023</p>
    </div>
</div>