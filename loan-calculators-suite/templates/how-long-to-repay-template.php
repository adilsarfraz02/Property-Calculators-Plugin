<?php
/**
 * Template for How Long To Repay Calculator
 *
 * @package Loan_Calculators_Suite
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}
?>
<div class="lcs-calculator how-long-to-repay-calculator">
    <h2><?php echo esc_html($atts['title']); ?></h2>
    
    <div class="lcs-calculator-container">
        <!-- Input Details Section -->
        <div class="lcs-calculator-section">
            <h3>Enter your details</h3>
            
            <div class="lcs-form-group">
                <label>Loan Amount</label>
                <div class="lcs-input-group">
                    <span class="lcs-currency">$</span>
                    <input type="text" id="loan-amount" value="250000" class="lcs-currency-input" data-type="currency">
                </div>
            </div>

            <div class="lcs-form-group">
                <label>Interest Rate</label>
                <div class="lcs-input-group">
                    <input type="text" id="interest-rate" value="5.00" class="lcs-rate-input" data-type="rate">
                    <span class="lcs-percentage">%</span>
                </div>
            </div>

            <div class="lcs-form-group">
                <label>Repayment</label>
                <div class="lcs-input-group">
                    <span class="lcs-currency">$</span>
                    <input type="text" id="repayment" value="2000" class="lcs-currency-input" data-type="currency">
                    <select id="repayment-frequency" class="lcs-frequency-select">
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
                <span class="lcs-result-label">Loan term</span>
                <span class="lcs-result-value" id="loan-term-result">15 years, 7 months</span>
            </div>
            <div class="lcs-result-item">
                <span class="lcs-result-label">Total interest payable</span>
                <span class="lcs-result-value" id="total-interest-result">$122,097.89</span>
            </div>
            <div class="lcs-result-item">
                <span class="lcs-result-label">Total payments</span>
                <span class="lcs-result-value" id="total-payments-result">$372,097.89</span>
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
                <p>This calculator help you find out how long it would take to repay a loan by paying different amounts.</p>
                <h4>Assumptions</h4>
                <ul>
                    <li>It does not take into account any possible fees i.e. up-front fees or ongoing fees.</li>
                    <li>Interest rate does not change over the loan term.</li>
                    <li>Interest is calculated by compounding on the same repayment frequency selected, i.e. weekly, fortnightly, monthly. In practice, interest compounding frequency may not be the same as repayment frequency.</li>
                    <li>It is assumed that a year consists 26 fortnights or 52 weeks which is counted as 364 days rather than 365 or 366 days.</li>
                    <li>No rounding is done throughout calculation whereas repayments are rounded to at least the nearer cent in practice.</li>
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